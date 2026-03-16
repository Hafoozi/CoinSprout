'use server'

import { hashPin, verifyPin } from '@/lib/auth/profile-switch-guard'
import { requireParent } from '@/lib/auth/require-parent'
import { updateChildPin } from '@/lib/db/mutations/children'
import { updateFamilyPin } from '@/lib/db/mutations/families'
import { getChildById } from '@/lib/db/queries/children'
import type { ActionResult } from '@/types/ui'

/** Set a 4-digit PIN for a child profile. */
export async function setChildPin(childId: string, pin: string): Promise<ActionResult> {
  try {
    await requireParent()
    if (!/^\d{4}$/.test(pin)) return { success: false, error: 'PIN must be exactly 4 digits' }
    const pinHash = await hashPin(pin)
    await updateChildPin(childId, pinHash)
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to set PIN' }
  }
}

/** Set or update the parent PIN for the family. */
export async function setParentPin(pin: string): Promise<ActionResult> {
  try {
    const { family } = await requireParent()
    if (!/^\d{4}$/.test(pin)) return { success: false, error: 'PIN must be exactly 4 digits' }
    const pinHash = await hashPin(pin)
    await updateFamilyPin(family.id, pinHash)
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to set PIN' }
  }
}

/** Verify a child's PIN before switching to their profile. */
export async function verifyChildPin(childId: string, pin: string): Promise<ActionResult> {
  try {
    await requireParent()
    const child = await getChildById(childId)
    if (!child) return { success: false, error: 'Child not found' }
    if (!child.pin_hash) return { success: false, error: 'No PIN set for this child' }
    const ok = await verifyPin(pin, child.pin_hash)
    if (!ok) return { success: false, error: 'Incorrect PIN' }
    return { success: true }
  } catch {
    return { success: false, error: 'Verification failed' }
  }
}

/** Verify the parent PIN before entering parent mode. */
export async function verifyParentPin(pin: string): Promise<ActionResult> {
  try {
    const { family } = await requireParent()
    // No PIN set yet — allow through so the parent isn't locked out
    if (!family.parent_pin_hash) return { success: true }
    const ok = await verifyPin(pin, family.parent_pin_hash)
    if (!ok) return { success: false, error: 'Incorrect PIN' }
    return { success: true }
  } catch {
    return { success: false, error: 'Verification failed' }
  }
}
