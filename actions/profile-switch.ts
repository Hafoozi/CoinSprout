'use server'

import { verifyPin } from '@/lib/auth/profile-switch-guard'
import type { ActionResult } from '@/types/ui'

/**
 * Verify a child's PIN before switching to their profile.
 * Returns success: true if PIN matches; the client then navigates to child view.
 */
export async function verifyChildPin(childId: string, pin: string): Promise<ActionResult> {
  // TODO: Implement
  // 1. Fetch child's pin_hash from DB
  // 2. Call verifyPin(pin, hash)
  // 3. Return result (never return the hash to the client)
  return { success: false, error: 'Not implemented' }
}

/**
 * Verify the parent PIN before entering parent mode.
 */
export async function verifyParentPin(familyId: string, pin: string): Promise<ActionResult> {
  // TODO: Implement
  return { success: false, error: 'Not implemented' }
}
