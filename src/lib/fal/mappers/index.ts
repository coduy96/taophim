// FAL Input Mappers Registry
// Maps service slugs to their input transformation functions

import { FalInput, OrderUserInputs, SERVICE_MODEL_MAP } from '../types'
import { mapImageToVideoInputs } from './image-to-video'
import { mapMotionControlInputs } from './motion-control'
import { mapTextToVideoInputs } from './text-to-video'

type InputMapper = (userInputs: OrderUserInputs) => FalInput

const mapperRegistry: Record<string, InputMapper> = {
  'anh-thanh-video': mapImageToVideoInputs,
  'thay-doi-nhan-vat': mapMotionControlInputs,
  'tao-video-tu-van-ban': mapTextToVideoInputs,
}

/**
 * Get the FAL input mapper for a service slug
 */
export function getInputMapper(serviceSlug: string): InputMapper | undefined {
  return mapperRegistry[serviceSlug]
}

/**
 * Map user inputs to FAL API inputs
 */
export function mapUserInputsToFal(serviceSlug: string, userInputs: OrderUserInputs): FalInput {
  const mapper = getInputMapper(serviceSlug)
  if (!mapper) {
    throw new Error(`No mapper found for service: ${serviceSlug}`)
  }
  return mapper(userInputs)
}

/**
 * Check if a service slug is supported for FAL processing
 */
export function isFalSupportedService(serviceSlug: string): boolean {
  return serviceSlug in SERVICE_MODEL_MAP
}

export { mapImageToVideoInputs } from './image-to-video'
export { mapMotionControlInputs } from './motion-control'
export { mapTextToVideoInputs } from './text-to-video'
