import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const pbkdf2Async = promisify(pbkdf2)
const ITERATIONS = 100_000
const KEYLEN     = 64
const DIGEST     = 'sha512'

/**
 * Hash a 4-digit PIN for storage using PBKDF2-SHA512.
 * Returns a string in the form "salt:hash" (both hex-encoded).
 * PIN hashing always happens server-side — never in Client Components.
 */
export async function hashPin(pin: string): Promise<string> {
  const salt    = randomBytes(16).toString('hex')
  const derived = await pbkdf2Async(pin, salt, ITERATIONS, KEYLEN, DIGEST)
  return `${salt}:${derived.toString('hex')}`
}

/**
 * Verify a plain PIN against a stored "salt:hash" string.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = await pbkdf2Async(pin, salt, ITERATIONS, KEYLEN, DIGEST)
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), derived)
  } catch {
    return false
  }
}
