// Text to Video (tao-video-tu-van-ban) mapper
// Maps form inputs to FAL kling-video/v2.6/pro/text-to-video parameters

import { TextToVideoInput, OrderUserInputs } from '../types'

export function mapTextToVideoInputs(userInputs: OrderUserInputs): TextToVideoInput {
  // Validate required fields
  const prompt = userInputs.prompt as string | undefined
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Missing or invalid prompt')
  }

  const duration = userInputs.duration_seconds
  if (typeof duration !== 'number' || duration < 1) {
    throw new Error('Missing or invalid duration_seconds')
  }

  // FAL expects duration as "5" or "10" string
  const falDuration: '5' | '10' = duration >= 10 ? '10' : '5'

  const result: TextToVideoInput = {
    prompt: prompt.trim(),
    duration: falDuration,
    generate_audio: userInputs.generate_audio !== false, // default true
  }

  // Optional fields
  if (userInputs.aspect_ratio && typeof userInputs.aspect_ratio === 'string') {
    result.aspect_ratio = userInputs.aspect_ratio
  }

  if (userInputs.negative_prompt && typeof userInputs.negative_prompt === 'string') {
    result.negative_prompt = userInputs.negative_prompt
  }

  return result
}
