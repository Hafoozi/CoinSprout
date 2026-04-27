import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getChildSettings } from '@/lib/db/queries/child-settings'
import { getRecurringAllowanceByChildId } from '@/lib/db/queries/recurring-allowances'
import { getRecurringInterestByChildId } from '@/lib/db/queries/recurring-interest'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { resolveChildSettings } from '@/lib/calculations/child-settings'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import SettingsPage from '@/components/parent/settings-page'
import type { ResolvedChildSettings } from '@/types/domain'
import type { CurrencySymbol, RecurringAllowance, RecurringInterest } from '@/lib/db/types'

export const metadata: Metadata = {
  title: 'Settings — CoinSprout',
}

export default async function SettingsPageRoute() {
  const { family, userId } = await requireParent()

  const [familySettings, children] = await Promise.all([
    getFamilySettings(family.id),
    getChildrenByFamilyId(family.id),
  ])

  const [settingsRows, allowanceRows, interestRows, txRows] = await Promise.all([
    Promise.all(children.map((c) => getChildSettings(c.id))),
    Promise.all(children.map((c) => getRecurringAllowanceByChildId(c.id))),
    Promise.all(children.map((c) => getRecurringInterestByChildId(c.id))),
    Promise.all(children.map((c) => getTransactionsByChildId(c.id))),
  ])

  const settingsMap: Record<string, ResolvedChildSettings> = Object.fromEntries(
    children.map((c, i) => [c.id, resolveChildSettings(settingsRows[i])])
  )

  const allowanceMap: Record<string, RecurringAllowance | null> = Object.fromEntries(
    children.map((c, i) => [c.id, allowanceRows[i]])
  )

  const interestMap: Record<string, RecurringInterest | null> = Object.fromEntries(
    children.map((c, i) => [c.id, interestRows[i]])
  )

  const savingsMap: Record<string, number> = Object.fromEntries(
    children.map((c, i) => [c.id, calculateSavingsBalance(txRows[i])])
  )

  return (
    <SettingsPage
      userId={userId}
      currency={(familySettings?.currency_symbol ?? DEFAULT_CURRENCY) as CurrencySymbol}
      hasParentPin={!!family.parent_pin_hash}
      quickAccessEnabled={familySettings?.quick_access_enabled ?? false}
      children={children}
      settingsMap={settingsMap}
      allowanceMap={allowanceMap}
      interestMap={interestMap}
      savingsMap={savingsMap}
    />
  )
}
