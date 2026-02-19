// FAL.ai API Types

// Service slug to FAL model mapping
export const SERVICE_MODEL_MAP: Record<string, string> = {
  'anh-thanh-video': 'xai/grok-imagine-video/image-to-video',
  'thay-doi-nhan-vat': 'fal-ai/kling-video/v2.6/pro/motion-control',
  'tao-video-tu-van-ban': 'xai/grok-imagine-video/text-to-video',
  'xoa-nen-video': 'bria/video/background-removal',
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
  duration?: number
  resolution?: '480p' | '720p'
  aspect_ratio?: string
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
  duration?: number
  resolution?: '480p' | '720p'
}

export interface BackgroundRemovalInput {
  video_url: string
  background_color?: 'Transparent' | 'Black' | 'White' | 'Gray' | 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Cyan' | 'Magenta' | 'Orange'
  output_container_and_codec?: 'mp4_h265' | 'mp4_h264' | 'webm_vp9' | 'mov_h265' | 'mov_proresks' | 'mkv_h265' | 'mkv_h264' | 'mkv_vp9' | 'gif'
}

// Combined FAL input type
export type FalInput = ImageToVideoInput | MotionControlInput | TextToVideoInput | BackgroundRemovalInput

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
