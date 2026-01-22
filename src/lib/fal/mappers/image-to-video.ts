// Image to Video (anh-thanh-video) mapper
// Maps form inputs to FAL kling-video/v2.6/pro/image-to-video parameters

import { ImageToVideoInput, OrderUserInputs } from '../types'

export function mapImageToVideoInputs(userInputs: OrderUserInputs): ImageToVideoInput {
  // Validate required fields
  const startImage = userInputs.start_image as string | undefined
  if (!startImage || typeof startImage !== 'string' || !startImage.startsWith('http')) {
    throw new Error('Missing or invalid start_image URL')
  }

  const duration = userInputs.duration_seconds
  if (typeof duration !== 'number' || duration < 1) {
    throw new Error('Missing or invalid duration_seconds')
  }

  // FAL expects duration as "5" or "10" string
  const falDuration: '5' | '10' = duration >= 10 ? '10' : '5'

  const result: ImageToVideoInput = {
    prompt: (userInputs.prompt as string) || '',
    start_image_url: startImage,
    duration: falDuration,
    generate_audio: userInputs.generate_audio !== false, // default true
  }

  // Optional fields
  const endImage = userInputs.end_image as string | undefined
  if (endImage && typeof endImage === 'string' && endImage.startsWith('http')) {
    result.end_image_url = endImage
  }

  if (userInputs.negative_prompt && typeof userInputs.negative_prompt === 'string') {
    result.negative_prompt = userInputs.negative_prompt
  }

  return result
}
