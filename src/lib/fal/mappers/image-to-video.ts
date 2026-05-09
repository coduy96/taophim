// Image to Video (anh-thanh-video) mapper
// Maps form inputs to xAI Grok Imagine Video image-to-video parameters

import { ImageToVideoInput, OrderUserInputs } from '../types'
import { buildVoicePromptPrefix } from '../voices'

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

  // Inject Vietnamese-language directive plus a detailed voice description so
  // the same selected voice produces consistent-sounding output across orders.
  const rawPrompt = ((userInputs.prompt as string) || '').trim()
  const prefix = buildVoicePromptPrefix(userInputs.voice as string | undefined)
  const vietnamesePrompt = rawPrompt ? `${prefix} ${rawPrompt}` : prefix

  const result: ImageToVideoInput = {
    prompt: vietnamesePrompt,
    image_url: startImage,
    duration: duration,
    resolution: '720p',
  }

  // Optional fields
  if (userInputs.aspect_ratio && typeof userInputs.aspect_ratio === 'string') {
    result.aspect_ratio = userInputs.aspect_ratio
  }

  return result
}
