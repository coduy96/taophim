// Text to Video (tao-video-tu-van-ban) mapper
// Maps form inputs to xAI Grok Imagine Video text-to-video parameters

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

  // Force Vietnamese voice/narration — prepend language directive so Grok
  // generates speech in Vietnamese instead of defaulting to English
  const vietnamesePrompt = `[Language: Vietnamese] The characters speak Vietnamese. All spoken dialogue, narration, and voice-over are in Vietnamese. ${prompt.trim()}`

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
