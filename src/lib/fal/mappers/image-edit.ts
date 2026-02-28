// Image Edit mapper for fal-ai/nano-banana-2/edit

import { OrderUserInputs, ImageEditInput } from '../types'

export function mapImageEditInputs(userInputs: OrderUserInputs): ImageEditInput {
  const prompt = userInputs.prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt is required for image editing')
  }

  const sourceImage = userInputs.source_image
  if (!sourceImage || typeof sourceImage !== 'string') {
    throw new Error('Source image is required for image editing')
  }

  return {
    prompt: prompt.trim(),
    image_urls: [sourceImage],
    resolution: '1K',
    aspect_ratio: (userInputs.aspect_ratio as string) || 'auto',
    output_format: 'png',
    num_images: 1,
    limit_generations: true,
  }
}
