// Text to Video (tao-video-tu-van-ban) mapper
// Maps form inputs to FAL veo3.1/fast parameters

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

  // Veo expects duration as "4s", "6s", or "8s"
  const veoDuration: '4s' | '6s' | '8s' = duration <= 4 ? '4s' : duration <= 6 ? '6s' : '8s'

  // Force Vietnamese voice/narration by appending language instruction
  const vietnamesePrompt = `${prompt.trim()}. All dialogue, narration, and voice-over must be in Vietnamese (tiếng Việt).`

  const result: TextToVideoInput = {
    prompt: vietnamesePrompt,
    duration: veoDuration,
    resolution: '1080p',
    auto_fix: true,
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
