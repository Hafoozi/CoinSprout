import { requireUser } from './require-user'
import { getFamilyByUserId } from '@/lib/db/queries/families'
import { createFamily } from '@/lib/db/mutations/families'
import type { Family } from '@/lib/db/types'

/**
 * Server-side helper: returns the authenticated user AND their family record.
 * Redirects to login if not authenticated.
 * Creates a family row on first use (handles the first sign-in after email confirmation).
 */
export async function requireParent(): Promise<{ userId: string; family: Family }> {
  const user   = await requireUser()
  let   family = await getFamilyByUserId(user.id)

  if (!family) {
    family = await createFamily(user.id)
  }

  if (!family) throw new Error('Could not initialize family record')
  return { userId: user.id, family }
}
