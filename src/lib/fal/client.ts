// FAL.ai Client Configuration

export const FAL_API_URL = 'https://queue.fal.run'
export const FAL_JWKS_URL = 'https://rest.alpha.fal.ai/.well-known/jwks.json'

// Get the FAL API key from environment
export function getFalApiKey(): string {
  const key = process.env.FAL_KEY
  if (!key) {
    throw new Error('FAL_KEY environment variable is not set')
  }
  return key
}

// Get the webhook URL for FAL callbacks
export function getWebhookUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL environment variable is not set')
  }
  return `${siteUrl}/api/fal/webhook`
}

// FAL API headers
export function getFalHeaders(): HeadersInit {
  return {
    'Authorization': `Key ${getFalApiKey()}`,
    'Content-Type': 'application/json',
  }
}
