// FAL Job Submission
// Submits orders to FAL queue with webhook callback

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { FAL_API_URL, getFalApiKey, getWebhookUrl } from './client'
import { SERVICE_MODEL_MAP, FalQueueResponse, OrderUserInputs } from './types'
import { mapUserInputsToFal, isFalSupportedService } from './mappers'

interface SubmitJobResult {
  success: boolean
  requestId?: string
  error?: string
}

/**
 * Get Supabase admin client with validation
 */
function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * Submit an order to FAL for processing
 * Returns the FAL request ID on success
 *
 * Flow: Create DB record first → Submit to FAL → Update status
 * This ensures we never have orphan FAL jobs without DB records
 */
export async function submitFalJob(
  orderId: string,
  serviceSlug: string,
  userInputs: OrderUserInputs
): Promise<SubmitJobResult> {
  // Verify service is supported
  if (!isFalSupportedService(serviceSlug)) {
    return {
      success: false,
      error: `Service ${serviceSlug} is not configured for FAL processing`,
    }
  }

  const modelId = SERVICE_MODEL_MAP[serviceSlug]
  if (!modelId) {
    return {
      success: false,
      error: `No FAL model configured for service: ${serviceSlug}`,
    }
  }

  let supabaseAdmin: SupabaseClient
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch (error) {
    console.error('Supabase admin client error:', error)
    return {
      success: false,
      error: 'Server configuration error',
    }
  }

  // Generate a placeholder request_id that we'll update after FAL responds
  // This ensures we have a DB record before calling FAL
  const placeholderRequestId = `pending_${orderId}_${Date.now()}`

  try {
    // Map user inputs to FAL format (with validation)
    const falInput = mapUserInputsToFal(serviceSlug, userInputs)

    // Step 1: Create fal_job record FIRST (before calling FAL)
    const { error: insertError } = await supabaseAdmin
      .from('fal_jobs')
      .insert({
        order_id: orderId,
        fal_request_id: placeholderRequestId,
        model_id: modelId,
        status: 'pending',
      })

    if (insertError) {
      console.error('Failed to insert fal_job:', insertError)
      return {
        success: false,
        error: `Database error: ${insertError.message}`,
      }
    }

    // Step 2: Submit to FAL queue with webhook
    const webhookUrl = getWebhookUrl()
    const response = await fetch(
      `${FAL_API_URL}/${modelId}?fal_webhook=${encodeURIComponent(webhookUrl)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${getFalApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(falInput),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FAL API error:', response.status, errorText)

      // Clean up the placeholder record
      await supabaseAdmin
        .from('fal_jobs')
        .delete()
        .eq('fal_request_id', placeholderRequestId)

      return {
        success: false,
        error: `FAL API error: ${response.status} - ${errorText}`,
      }
    }

    const result = await response.json() as FalQueueResponse

    if (!result.request_id) {
      // Clean up the placeholder record
      await supabaseAdmin
        .from('fal_jobs')
        .delete()
        .eq('fal_request_id', placeholderRequestId)

      return {
        success: false,
        error: 'FAL response missing request_id',
      }
    }

    // Step 3: Update the fal_job with real request_id
    const { error: updateJobError } = await supabaseAdmin
      .from('fal_jobs')
      .update({ fal_request_id: result.request_id })
      .eq('fal_request_id', placeholderRequestId)

    if (updateJobError) {
      console.error('Failed to update fal_job request_id:', updateJobError)
      // Job is submitted to FAL but we couldn't update our record
      // Log this for manual intervention
    }

    // Step 4: Update order status to processing
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      // Don't fail - job is submitted successfully
    }

    return {
      success: true,
      requestId: result.request_id,
    }
  } catch (error) {
    console.error('FAL submission error:', error)

    // Attempt to clean up placeholder record on error
    try {
      await supabaseAdmin
        .from('fal_jobs')
        .delete()
        .eq('fal_request_id', placeholderRequestId)
    } catch {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
