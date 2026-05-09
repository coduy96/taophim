// Text to Video (tao-video-tu-van-ban) mapper
// Maps form inputs to xAI Grok Imagine Video text-to-video parameters

import { TextToVideoInput, OrderUserInputs } from '../types'
import { buildVoicePromptPrefix } from '../voices'

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

  // Inject Vietnamese-language directive plus a detailed voice description so
  // the same selected voice produces consistent-sounding output across orders.
  const prefix = buildVoicePromptPrefix(userInputs.voice as string | undefined)
  const vietnamesePrompt = `${prefix} ${prompt.trim()}`

  const result: TextToVideoInput = {
    prompt: vietnamesePrompt,
    duration: duration,
    resolution: '720p',
  }

  // Optional fields
  if (userInputs.aspect_ratio && typeof userInputs.aspect_ratio === 'string') {
    result.aspect_ratio = userInputs.aspect_ratio
  }

  return result
}
