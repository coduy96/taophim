// Image to Video (anh-thanh-video) mapper
// Maps form inputs to FAL veo3.1/fast/image-to-video parameters

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

  // Veo expects duration as "4s", "6s", or "8s"
  const veoDuration: '4s' | '6s' | '8s' = duration <= 4 ? '4s' : duration <= 6 ? '6s' : '8s'

  // Force Vietnamese voice/narration — prepend language directive so Veo
  // generates speech in Vietnamese instead of defaulting to English
  const rawPrompt = ((userInputs.prompt as string) || '').trim()
  const vietnamesePrefix = '[Language: Vietnamese] The characters speak Vietnamese. All spoken dialogue, narration, and voice-over are in Vietnamese.'
  const vietnamesePrompt = rawPrompt
    ? `${vietnamesePrefix} ${rawPrompt}`
    : vietnamesePrefix

  const result: ImageToVideoInput = {
    prompt: vietnamesePrompt,
    image_url: startImage,
    duration: veoDuration,
    resolution: '1080p',
    auto_fix: false,
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
