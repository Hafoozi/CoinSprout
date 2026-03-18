import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getChildSettings } from '@/lib/db/queries/child-settings'
import { getRecurringAllowanceByChildId } from '@/lib/db/queries/recurring-allowances'
import { resolveChildSettings } from '@/lib/calculations/child-settings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import SettingsPage from '@/components/parent/settings-page'
import type { ResolvedChildSettings } from '@/types/domain'
import type { CurrencySymbol, RecurringAllowance } from '@/lib/db/types'

export const metadata: Metadata = {
  title: 'Settings — CoinSprout',
}

export default async function SettingsPageRoute() {
  const { family } = await requireParent()

  const [familySettings, children] = await Promise.all([
    getFamilySettings(family.id),
    getChildrenByFamilyId(family.id),
  ])

  const [settingsRows, allowanceRows] = await Promise.all([
    Promise.all(children.map((c) => getChildSettings(c.id))),
    Promise.all(children.map((c) => getRecurringAllowanceByChildId(c.id))),
  ])

  const settingsMap: Record<string, ResolvedChildSettings> = Object.fromEntries(
    children.map((c, i) => [c.id, resolveChildSettings(settingsRows[i])])
  )

  const allowanceMap: Record<string, RecurringAllowance | null> = Object.fromEntries(
    children.map((c, i) => [c.id, allowanceRows[i]])
  )

  return (
    <SettingsPage
      currency={(familySettings?.currency_symbol ?? DEFAULT_CURRENCY) as CurrencySymbol}
      hasParentPin={!!family.parent_pin_hash}
      children={children}
      settingsMap={settingsMap}
      allowanceMap={allowanceMap}
    />
  )
}
