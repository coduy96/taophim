// Motion Control (thay-doi-nhan-vat) mapper
// Maps form inputs to FAL kling-video/v2.6/pro/motion-control parameters

import { MotionControlInput, OrderUserInputs } from '../types'

export function mapMotionControlInputs(userInputs: OrderUserInputs): MotionControlInput {
  // Validate required fields
  const referenceImage = userInputs.reference_image as string | undefined
  if (!referenceImage || typeof referenceImage !== 'string' || !referenceImage.startsWith('http')) {
    throw new Error('Missing or invalid reference_image URL')
  }

  const referenceVideo = userInputs.reference_video as string | undefined
  if (!referenceVideo || typeof referenceVideo !== 'string' || !referenceVideo.startsWith('http')) {
    throw new Error('Missing or invalid reference_video URL')
  }

  const result: MotionControlInput = {
    image_url: referenceImage,
    video_url: referenceVideo,
    keep_original_sound: userInputs.keep_original_sound !== false, // default true
  }

  // Optional fields
  if (userInputs.prompt && typeof userInputs.prompt === 'string') {
    result.prompt = userInputs.prompt
  }

  if (userInputs.character_orientation && typeof userInputs.character_orientation === 'string') {
    result.character_orientation = userInputs.character_orientation
  }

  return result
}
