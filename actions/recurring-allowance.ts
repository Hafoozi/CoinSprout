'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertRecurringAllowance, setNextPaymentDate } from '@/lib/db/mutations/recurring-allowances'
import { getRecurringAllowanceByChildId } from '@/lib/db/queries/recurring-allowances'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { calcNextPaymentDate, addDaysToDate } from '@/lib/utils/payment-date'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

async function verifyChild(familyId: string, childId: string): Promise<boolean> {
  const children = await getChildrenByFamilyId(familyId)
  return children.some((c) => c.id === childId)
}

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

  if (!await verifyChild(family.id, childId)) {
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

  // Preserve existing next_payment_date if the day hasn't changed.
  // Recalculate if new record or day changed.
  const existing = await getRecurringAllowanceByChildId(childId)
  const nextPaymentDate =
    existing && existing.day_of_week === dayOfWeek && existing.next_payment_date
      ? existing.next_payment_date
      : calcNextPaymentDate(dayOfWeek)

  const result = await upsertRecurringAllowance({
    childId, amount, dayOfWeek, hourOfDay, isActive, nextPaymentDate,
  })
  if (!result) return { success: false, error: 'Failed to save' }

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

/** Skip the next allowance payout — pushes next_payment_date forward by 7 days. */
export async function skipNextAllowance(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  if (!await verifyChild(family.id, childId)) {
    return { success: false, error: 'Child not found' }
  }

  const allowance = await getRecurringAllowanceByChildId(childId)
  if (!allowance?.is_active) return { success: false, error: 'No active allowance' }

  const base = allowance.next_payment_date ?? calcNextPaymentDate(allowance.day_of_week)
  await setNextPaymentDate(childId, addDaysToDate(base, 7))

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

/** Undo a skip — resets next_payment_date to the next natural occurrence. */
export async function undoSkipAllowance(childId: string): Promise<ActionResult> {
  const { family } = await requireParent()

  if (!await verifyChild(family.id, childId)) {
    return { success: false, error: 'Child not found' }
  }

  const allowance = await getRecurringAllowanceByChildId(childId)
  if (!allowance?.is_active) return { success: false, error: 'No active allowance' }

  await setNextPaymentDate(childId, calcNextPaymentDate(allowance.day_of_week))

  revalidatePath(ROUTES.PARENT.SETTINGS)
  revalidatePath(ROUTES.PARENT.CHILD(childId))
  return { success: true }
}

export async function setAllowanceOverride(
  childId: string,
  override: number | null
): Promise<ActionResult> {
  const { family } = await requireParent()

  if (!await verifyChild(family.id, childId)) {
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
