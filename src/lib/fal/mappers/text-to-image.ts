// Text-to-Image mapper for fal-ai/nano-banana-2

import { OrderUserInputs, TextToImageInput } from '../types'

export function mapTextToImageInputs(userInputs: OrderUserInputs): TextToImageInput {
  const prompt = userInputs.prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt is required for text-to-image generation')
  }

  return {
    prompt: prompt.trim(),
    resolution: '1K',
    aspect_ratio: (userInputs.aspect_ratio as string) || 'auto',
    output_format: 'png',
    num_images: 1,
  }
}
