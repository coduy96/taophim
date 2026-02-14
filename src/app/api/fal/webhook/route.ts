// FAL Webhook Handler
// Receives callbacks from FAL when video processing completes

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, isTimestampValid } from '@/lib/fal/verify-webhook'
import { FalWebhookPayload, FalErrorDetail } from '@/lib/fal/types'
import { createOrderCompletedNotification, createOrderCancelledNotification } from '@/lib/notifications/in-app'

// Map FAL error types to user-friendly Vietnamese messages
const FAL_ERROR_MESSAGES: Record<string, string> = {
  content_policy_violation:
    'Nội dung không phù hợp với chính sách sử dụng. Vui lòng kiểm tra lại hình ảnh/video đầu vào.',
  image_too_small:
    'Hình ảnh quá nhỏ. Vui lòng sử dụng hình ảnh có kích thước lớn hơn.',
  image_too_large:
    'Hình ảnh quá lớn. Vui lòng sử dụng hình ảnh có kích thước nhỏ hơn.',
  image_load_error:
    'Không thể đọc hình ảnh. Hình ảnh có thể bị lỗi hoặc không đúng định dạng.',
  file_download_error:
    'Không thể tải file đầu vào. Vui lòng kiểm tra lại file và thử lại.',
  face_detection_error:
    'Không phát hiện khuôn mặt trong hình ảnh. Vui lòng sử dụng hình ảnh có khuôn mặt rõ ràng.',
  file_too_large:
    'File quá lớn. Vui lòng sử dụng file có kích thước nhỏ hơn.',
  generation_timeout:
    'Quá trình tạo video bị hết thời gian chờ. Vui lòng thử lại.',
  internal_server_error:
    'Hệ thống xử lý video gặp lỗi. Vui lòng thử lại sau.',
  downstream_service_error:
    'Dịch vụ xử lý video tạm thời gặp sự cố. Vui lòng thử lại sau.',
  downstream_service_unavailable:
    'Dịch vụ xử lý video tạm thời không khả dụng. Vui lòng thử lại sau.',
  unsupported_image_format:
    'Định dạng hình ảnh không được hỗ trợ. Vui lòng sử dụng JPG, PNG hoặc WebP.',
  unsupported_video_format:
    'Định dạng video không được hỗ trợ. Vui lòng sử dụng MP4, MOV hoặc WebM.',
  unsupported_audio_format:
    'Định dạng âm thanh không được hỗ trợ.',
  video_duration_too_long:
    'Video đầu vào quá dài. Vui lòng sử dụng video ngắn hơn.',
  video_duration_too_short:
    'Video đầu vào quá ngắn. Vui lòng sử dụng video dài hơn.',
  audio_duration_too_long:
    'File âm thanh quá dài. Vui lòng sử dụng file ngắn hơn.',
  audio_duration_too_short:
    'File âm thanh quá ngắn. Vui lòng sử dụng file dài hơn.',
}

const DEFAULT_ERROR_MESSAGE = 'Xử lý video không thành công.'

// Pattern-based matching on raw error strings.
// Order matters: specific patterns first, broad catch-alls last.
const FAL_ERROR_MESSAGE_PATTERNS: { pattern: RegExp; message: string }[] = [
  // Specific patterns first (for when FAL forwards detailed error messages)
  {
    pattern: /too many subjects/i,
    message: 'Video có quá nhiều người/đối tượng. Vui lòng sử dụng video chỉ có 1 người hoặc đối tượng rõ ràng.',
  },
  {
    pattern: /duration.*(?:cannot|can ?not|must not).*(?:longer|exceed)/i,
    message: 'Video đầu vào vượt quá thời lượng cho phép. Vui lòng sử dụng video ngắn hơn.',
  },
  {
    pattern: /character orientation.*image.*duration/i,
    message: 'Khi sử dụng ảnh làm nhân vật, video không được dài quá 10 giây. Vui lòng rút ngắn video.',
  },
  {
    pattern: /validat/i,
    message: 'Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại file và thông tin đã nhập.',
  },
  // Broad catch-alls last — FAL wraps upstream 422s as "Unexpected status code: 422" without detail
  {
    pattern: /(?:status code.*422|422.*unprocessable)/i,
    message: 'File đầu vào không đạt yêu cầu xử lý. Vui lòng kiểm tra: video không quá dài, hình ảnh rõ nét, đúng định dạng (MP4, JPG, PNG), và chỉ có 1 người/đối tượng chính trong khung hình.',
  },
  // Catch other unexpected status codes from FAL (500, 503, etc.)
  {
    pattern: /unexpected status code/i,
    message: 'Hệ thống xử lý video gặp lỗi. Vui lòng thử lại sau.',
  },
]

/**
 * Extract structured error details from the FAL webhook payload.
 * FAL may include error info in `detail` array or in `error` string field.
 */
function parseFalError(payload: FalWebhookPayload): {
  errorType: string | null
  details: FalErrorDetail[]
  rawError: string
} {
  // Check for structured detail array in the payload
  if (payload.detail && Array.isArray(payload.detail) && payload.detail.length > 0) {
    const first = payload.detail[0]
    return {
      errorType: first.type || null,
      details: payload.detail,
      rawError: payload.detail.map(d => `[${d.type}] ${d.msg}`).join('; '),
    }
  }

  // Try to parse error string as JSON (FAL sometimes sends JSON in error field)
  if (payload.error && typeof payload.error === 'string') {
    try {
      const parsed = JSON.parse(payload.error)
      if (parsed.detail && Array.isArray(parsed.detail) && parsed.detail.length > 0) {
        const first = parsed.detail[0]
        return {
          errorType: first.type || null,
          details: parsed.detail,
          rawError: parsed.detail.map((d: FalErrorDetail) => `[${d.type}] ${d.msg}`).join('; '),
        }
      }
    } catch {
      // Not JSON, treat as plain string
    }
  }

  return {
    errorType: null,
    details: [],
    rawError: payload.error || 'Processing failed',
  }
}

/**
 * Get a meaningful Vietnamese error message based on FAL error type.
 * Always appends the Xu refund notice.
 */
function getVietnameseErrorMessage(errorType: string | null, rawError: string): string {
  // 1. Try exact type match first
  if (errorType && FAL_ERROR_MESSAGES[errorType]) {
    return `${FAL_ERROR_MESSAGES[errorType]} Xu đã được hoàn trả.`
  }
  // 2. Try pattern matching on raw error message
  for (const { pattern, message } of FAL_ERROR_MESSAGE_PATTERNS) {
    if (pattern.test(rawError)) {
      return `${message} Xu đã được hoàn trả.`
    }
  }
  // 3. Default fallback
  return `${DEFAULT_ERROR_MESSAGE} Xu đã được hoàn trả.`
}

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
      // Parse structured error for meaningful Vietnamese message
      const { errorType, rawError } = parseFalError(payload)
      const userFacingMessage = getVietnameseErrorMessage(errorType, rawError)

      // Log full payload for ERROR webhooks to help improve error parsing
      console.log('FAL error payload:', JSON.stringify({ error: payload.error, detail: payload.detail, status: payload.status }))
      console.log('FAL error details:', { errorType, rawError, userFacingMessage, orderId: falJob.order_id })

      // Update fal_job with internal error (for admin debugging)
      await supabase
        .from('fal_jobs')
        .update({
          status: 'failed',
          error_message: rawError,
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

      console.log('Order cancelled due to processing error:', falJob.order_id, rawError)
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
