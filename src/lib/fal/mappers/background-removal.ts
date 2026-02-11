// Background Removal (xoa-nen-video) mapper
// Maps form inputs to FAL bria/video/background-removal parameters

import { BackgroundRemovalInput, OrderUserInputs } from '../types'

export function mapBackgroundRemovalInputs(userInputs: OrderUserInputs): BackgroundRemovalInput {
  // Validate required fields
  const sourceVideo = userInputs.source_video as string | undefined
  if (!sourceVideo || typeof sourceVideo !== 'string' || !sourceVideo.startsWith('http')) {
    throw new Error('Missing or invalid source_video URL')
  }

  const result: BackgroundRemovalInput = {
    video_url: sourceVideo,
  }

  // Optional fields
  if (userInputs.background_color && typeof userInputs.background_color === 'string') {
    result.background_color = userInputs.background_color as BackgroundRemovalInput['background_color']
  }

  if (userInputs.output_format && typeof userInputs.output_format === 'string') {
    result.output_container_and_codec = userInputs.output_format as BackgroundRemovalInput['output_container_and_codec']
  }

  return result
}
