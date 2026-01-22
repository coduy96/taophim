// FAL Webhook Handler
// Receives callbacks from FAL when video processing completes

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, isTimestampValid } from '@/lib/fal/verify-webhook'
import { FalWebhookPayload } from '@/lib/fal/types'
import { createOrderCompletedNotification, createOrderCancelledNotification } from '@/lib/notifications/in-app'

// Create admin client for database operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: Request) {
  try {
    // Extract headers
    const requestId = request.headers.get('X-Fal-Webhook-Request-Id')
    const falUserId = request.headers.get('X-Fal-Webhook-User-Id')
    const timestamp = request.headers.get('X-Fal-Webhook-Timestamp')
    const signature = request.headers.get('X-Fal-Webhook-Signature')

    // Validate required headers
    if (!requestId || !falUserId || !timestamp || !signature) {
      console.error('Missing webhook headers:', {
        hasRequestId: !!requestId,
        hasFalUserId: !!falUserId,
        hasTimestamp: !!timestamp,
        hasSignature: !!signature,
      })
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      )
    }

    // Validate timestamp to prevent replay attacks
    if (!isTimestampValid(timestamp)) {
      console.error('Webhook timestamp too old:', timestamp)
      return NextResponse.json(
        { error: 'Timestamp expired' },
        { status: 401 }
      )
    }

    // Get request body as text for signature verification
    const body = await request.text()

    // Verify signature
    const verification = await verifyWebhookSignature(
      requestId,
      falUserId,
      timestamp,
      signature,
      body
    )

    if (!verification.valid) {
      console.error('Webhook signature verification failed:', {
        error: verification.error,
        requestId,
        falUserId,
        timestamp,
      })
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload: FalWebhookPayload = JSON.parse(body)
    const { request_id: falRequestId, status, payload: resultPayload, error } = payload

    console.log('FAL webhook received:', { falRequestId, status })

    // Security: Verify request_id in payload matches the signed header
    if (falRequestId !== requestId) {
      console.error('Request ID mismatch:', { header: requestId, payload: falRequestId })
      return NextResponse.json(
        { error: 'Request ID mismatch' },
        { status: 400 }
      )
    }

    // Look up the fal_job by request_id
    const supabase = getSupabaseAdmin()

    const { data: falJob, error: lookupError } = await supabase
      .from('fal_jobs')
      .select('id, order_id, status')
      .eq('fal_request_id', falRequestId)
      .single()

    if (lookupError || !falJob) {
      console.error('FAL job not found for request_id:', falRequestId, lookupError)
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if job is already processed
    if (falJob.status === 'completed' || falJob.status === 'failed') {
      console.log('Job already processed:', falRequestId)
      return NextResponse.json({ success: true, message: 'Already processed' })
    }

    // Fetch order details with service and user info for notifications
    const { data: orderData, error: orderFetchError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        services:service_id (name),
        profiles:user_id (email, full_name)
      `)
      .eq('id', falJob.order_id)
      .single()

    if (orderFetchError || !orderData) {
      console.error('Failed to fetch order details:', orderFetchError)
      // Continue without notifications - order completion is more important
    }

    // Extract notification details
    // Note: Supabase returns single objects for foreign key relations, not arrays
    const serviceData = orderData?.services as unknown as { name: string } | null
    const serviceName = serviceData?.name || 'Video'
    const userProfile = orderData?.profiles as unknown as { email: string | null; full_name: string | null } | null
    const userEmail = userProfile?.email || null
    const userName = userProfile?.full_name || null
    const userId = orderData?.user_id

    if (status === 'OK' && resultPayload?.video?.url) {
      // Success: Complete the order
      const videoUrl = resultPayload.video.url

      // Update fal_job
      await supabase
        .from('fal_jobs')
        .update({
          status: 'completed',
          result_url: videoUrl,
          completed_at: new Date().toISOString(),
        })
        .eq('id', falJob.id)

      // Complete the order using RPC function
      // This will deduct frozen_xu and set status to completed
      const { error: completeError } = await supabase.rpc('complete_order', {
        p_order_id: falJob.order_id,
        p_admin_output: { result_url: videoUrl },
      })

      if (completeError) {
        console.error('Failed to complete order:', completeError)
        // Still return success to FAL - job is complete on their end
        // We'll need to handle this manually
      }

      // Send in-app notification
      if (userId) {
        try {
          await createOrderCompletedNotification(supabase, {
            userId,
            orderId: falJob.order_id,
            serviceName,
            videoUrl,
          })
        } catch (notifyError) {
          console.error('Failed to create notification:', notifyError)
          // Don't fail the webhook for notification errors
        }
      }

      console.log('Order completed:', falJob.order_id, 'Video:', videoUrl)
      return NextResponse.json({ success: true })
    } else {
      // Error: Cancel the order and refund
      // Store original error for logs but show generic message to user
      const internalError = error || 'Processing failed'
      const userFacingMessage = 'Xử lý video không thành công. Xu đã được hoàn trả.'

      // Update fal_job with internal error (for admin debugging)
      await supabase
        .from('fal_jobs')
        .update({
          status: 'failed',
          error_message: internalError,
          completed_at: new Date().toISOString(),
        })
        .eq('id', falJob.id)

      // Cancel the order using RPC function
      // This will refund frozen_xu to xu_balance
      const { error: cancelError } = await supabase.rpc('cancel_order', {
        p_order_id: falJob.order_id,
        p_admin_note: userFacingMessage,
      })

      if (cancelError) {
        console.error('Failed to cancel order:', cancelError)
      }

      // Send in-app notification
      if (userId) {
        try {
          await createOrderCancelledNotification(supabase, {
            userId,
            orderId: falJob.order_id,
            serviceName,
            reason: userFacingMessage,
          })
        } catch (notifyError) {
          console.error('Failed to create notification:', notifyError)
          // Don't fail the webhook for notification errors
        }
      }

      console.log('Order cancelled due to processing error:', falJob.order_id, internalError)
      return NextResponse.json({ success: true, error_handled: true })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  })
}
