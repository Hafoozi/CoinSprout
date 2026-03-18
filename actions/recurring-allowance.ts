'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertRecurringAllowance } from '@/lib/db/mutations/recurring-allowances'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function saveRecurringAllowance(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const { family } = await requireParent()

  const childId     = formData.get('childId')    as string
  const amountStr   = formData.get('amount')     as string
  const dayStr      = formData.get('dayOfWeek')  as string
  const hourStr     = formData.get('hourOfDay')  as string
  const isActiveStr = formData.get('isActive')   as string

  if (!childId || !amountStr || !dayStr) {
    return { success: false, error: 'Missing required fields' }
  }

  // Verify this child belongs to the family
  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  const amount    = parseFloat(amountStr)
  const dayOfWeek = parseInt(dayStr, 10)
  const hourOfDay = parseInt(hourStr ?? '9', 10)
  const isActive  = isActiveStr === 'true'

  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Amount must be greater than 0' }
  }
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return { success: false, error: 'Invalid day of week' }
  }
  if (isNaN(hourOfDay) || hourOfDay < 0 || hourOfDay > 23) {
    return { success: false, error: 'Invalid time' }
  }

  const result = await upsertRecurringAllowance({ childId, amount, dayOfWeek, hourOfDay, isActive })
  if (!result) return { success: false, error: 'Failed to save' }

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

export async function setAllowanceOverride(
  childId: string,
  override: number | null
): Promise<ActionResult> {
  const { family } = await requireParent()

  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  if (override !== null && (isNaN(override) || override <= 0)) {
    return { success: false, error: 'Amount must be greater than 0' }
  }

  const { setNextAmountOverride } = await import('@/lib/db/mutations/recurring-allowances')
  await setNextAmountOverride(childId, override)

  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

export async function undoSkipAllowance(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  const { updateLastPromptedAt } = await import('@/lib/db/mutations/recurring-allowances')
  await updateLastPromptedAt(childId, null)

  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

export async function skipNextAllowance(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  const children = await getChildrenByFamilyId(family.id)
  if (!children.some((c) => c.id === childId)) {
    return { success: false, error: 'Child not found' }
  }

  // Find the allowance to get day_of_week
  const { getRecurringAllowanceByChildId } = await import('@/lib/db/queries/recurring-allowances')
  const allowance = await getRecurringAllowanceByChildId(childId)
  if (!allowance?.is_active) return { success: false, error: 'No active allowance' }

  // Calculate next occurrence date
  const today      = new Date()
  const todayDay   = today.getDay()
  let daysUntil    = (allowance.day_of_week - todayDay + 7) % 7
  if (daysUntil === 0) daysUntil = 7 // already ran today or same day next week
  const nextDate   = new Date(today)
  nextDate.setDate(today.getDate() + daysUntil)
  const nextDateStr = nextDate.toISOString().slice(0, 10)

  const { updateLastPromptedAt } = await import('@/lib/db/mutations/recurring-allowances')
  await updateLastPromptedAt(childId, nextDateStr + 'T00:00:00.000Z')

  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}
