// FAL.ai API Types

// Service slug to FAL model mapping
export const SERVICE_MODEL_MAP: Record<string, string> = {
  'anh-thanh-video': 'fal-ai/veo3.1/fast/image-to-video',
  'thay-doi-nhan-vat': 'fal-ai/kling-video/v2.6/pro/motion-control',
  'tao-video-tu-van-ban': 'fal-ai/veo3.1/fast',
}

// FAL Queue Response
export interface FalQueueResponse {
  request_id: string
  gateway_request_id?: string
  status?: string
}

// FAL Queue Error
export interface FalQueueError {
  detail: string
}

// FAL Error Detail (structured error from FAL API)
export interface FalErrorDetail {
  loc: string[]
  msg: string
  type: string
  url?: string
  ctx?: Record<string, unknown>
  input?: unknown
}

// FAL Webhook Payload
export interface FalWebhookPayload {
  request_id: string
  gateway_request_id?: string
  status: 'OK' | 'ERROR'
  error?: string
  payload?: FalVideoResult
  detail?: FalErrorDetail[]
}

// FAL Video Result
export interface FalVideoResult {
  video?: {
    url: string
    content_type?: string
    file_name?: string
    file_size?: number
  }
}

// Input types for each FAL model
export interface ImageToVideoInput {
  prompt: string
  image_url: string
  duration: '4s' | '6s' | '8s'
  resolution?: string
  aspect_ratio?: string
  auto_fix?: boolean
  generate_audio?: boolean
  negative_prompt?: string
}

export interface MotionControlInput {
  prompt?: string
  image_url: string
  video_url: string
  character_orientation?: string
  keep_original_sound?: boolean
}

export interface TextToVideoInput {
  prompt: string
  aspect_ratio?: string
  duration: '4s' | '6s' | '8s'
  resolution?: string
  auto_fix?: boolean
  generate_audio?: boolean
  negative_prompt?: string
}

// Combined FAL input type
export type FalInput = ImageToVideoInput | MotionControlInput | TextToVideoInput

// FAL Job Status
export type FalJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

// FAL Job record (matching database schema)
export interface FalJob {
  id: string
  order_id: string
  fal_request_id: string
  model_id: string
  status: FalJobStatus
  result_url: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

// User inputs from order (generic type)
export interface OrderUserInputs {
  duration_seconds: number
  [key: string]: string | boolean | number | undefined
}
