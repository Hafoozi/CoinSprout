'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { upsertFamilySettings } from '@/lib/db/mutations/family-settings'
import { CURRENCY_OPTIONS } from '@/lib/constants/currencies'
import type { CurrencySymbol } from '@/lib/db/types'
import type { ActionResult } from '@/types/ui'

export async function saveCurrencySettings(_: unknown, formData: FormData): Promise<ActionResult> {
  const { family } = await requireParent()
  const symbol = formData.get('currencySymbol') as string

  const validSymbols = CURRENCY_OPTIONS.map((o) => o.symbol)
  if (!validSymbols.includes(symbol as CurrencySymbol)) {
    return { success: false, error: 'Invalid currency selection' }
  }

  const result = await upsertFamilySettings({ familyId: family.id, currencySymbol: symbol })
  if (!result) return { success: false, error: 'Failed to save settings' }

  revalidatePath('/', 'layout')
  return { success: true }
}
