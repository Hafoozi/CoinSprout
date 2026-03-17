import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { getChildDashboardData } from '@/lib/db/queries/dashboards'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import { CurrencyProvider } from '@/components/providers/currency-provider'

export const dynamic = 'force-dynamic'

// Skip SSR — the dashboard uses localStorage and has no SEO value.
const ChildDashboard = dynamicImport(
  () => import('@/components/child/child-dashboard'),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'My Tree — CoinSprout',
}

export default async function ChildTreePage({
  params,
}: {
  params: { childId: string }
}) {
  const { family } = await requireParent()

  const [child, dashboardData, familySettings] = await Promise.all([
    getChildById(params.childId),
    getChildDashboardData(params.childId),
    getFamilySettings(family.id),
  ])

  if (!child || !dashboardData) notFound()

  const currency = familySettings?.currency_symbol ?? DEFAULT_CURRENCY

  return (
    <CurrencyProvider symbol={currency}>
      <ChildDashboard
        child={child}
        summary={dashboardData.summary}
        transactions={dashboardData.transactions}
        goals={dashboardData.goals}
        settings={dashboardData.settings}
      />
    </CurrencyProvider>
  )
}
