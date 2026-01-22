// FAL Webhook Signature Verification
// Verifies webhook signatures using FAL's JWKS endpoint

import sodium from 'libsodium-wrappers'
import { FAL_JWKS_URL } from './client'

interface JwksKey {
  kty: string
  crv: string
  x: string
  kid: string
}

interface JwksResponse {
  keys: JwksKey[]
}

// Cache JWKS keys to avoid fetching on every request
let cachedKeys: JwksKey[] | null = null
let cacheExpiry: number = 0
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

/**
 * Fetch JWKS keys from FAL
 */
async function fetchJwks(): Promise<JwksKey[]> {
  const now = Date.now()

  // Return cached keys if still valid
  if (cachedKeys && now < cacheExpiry) {
    return cachedKeys
  }

  try {
    const response = await fetch(FAL_JWKS_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.status}`)
    }

    const jwks = await response.json() as JwksResponse
    cachedKeys = jwks.keys
    cacheExpiry = now + CACHE_DURATION_MS

    return cachedKeys
  } catch (error) {
    // If fetch fails but we have cached keys, use them
    if (cachedKeys) {
      console.warn('Failed to refresh JWKS, using cached keys:', error)
      return cachedKeys
    }
    throw error
  }
}

/**
 * Convert base64url to Uint8Array
 */
function base64urlToUint8Array(base64url: string): Uint8Array {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '='
  }

  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export interface WebhookVerificationResult {
  valid: boolean
  error?: string
}

/**
 * Verify FAL webhook signature
 *
 * Headers expected:
 * - X-Fal-Webhook-Request-Id: Unique request ID
 * - X-Fal-Webhook-Timestamp: Unix timestamp
 * - X-Fal-Webhook-Signature: Base64url encoded signature
 *
 * The signed message is: `${requestId}.${timestamp}.${bodyHash}`
 * where bodyHash is the SHA-256 hash of the request body
 */
export async function verifyWebhookSignature(
  requestId: string,
  timestamp: string,
  signature: string,
  body: string
): Promise<WebhookVerificationResult> {
  try {
    // Initialize libsodium
    await sodium.ready

    // Fetch JWKS keys
    const keys = await fetchJwks()

    if (keys.length === 0) {
      return { valid: false, error: 'No JWKS keys available' }
    }

    // Compute SHA-256 hash of body
    const bodyBytes = new TextEncoder().encode(body)
    const bodyHashBuffer = await crypto.subtle.digest('SHA-256', bodyBytes)
    const bodyHash = btoa(String.fromCharCode(...new Uint8Array(bodyHashBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Construct the signed message
    const signedMessage = `${requestId}.${timestamp}.${bodyHash}`
    const messageBytes = new TextEncoder().encode(signedMessage)

    // Decode signature
    const signatureBytes = base64urlToUint8Array(signature)

    // Try verification with each key
    for (const key of keys) {
      if (key.kty !== 'OKP' || key.crv !== 'Ed25519') {
        continue
      }

      try {
        // Decode the public key from base64url
        const publicKeyBytes = base64urlToUint8Array(key.x)

        // Verify using libsodium
        const valid = sodium.crypto_sign_verify_detached(
          signatureBytes,
          messageBytes,
          publicKeyBytes
        )

        if (valid) {
          return { valid: true }
        }
      } catch {
        // Try next key
        continue
      }
    }

    return { valid: false, error: 'Signature verification failed with all keys' }
  } catch (error) {
    console.error('Webhook verification error:', error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    }
  }
}

/**
 * Check if timestamp is within acceptable range (5 minutes)
 */
export function isTimestampValid(timestamp: string): boolean {
  const ts = parseInt(timestamp, 10)
  if (isNaN(ts)) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  const diff = Math.abs(now - ts)

  // Allow 5 minutes of clock skew
  return diff <= 300
}
