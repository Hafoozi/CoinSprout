import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { getChildDashboardData } from '@/lib/db/queries/dashboards'
import ChildDashboard from '@/components/child/child-dashboard'

export const metadata: Metadata = {
  title: 'My Tree — CoinSprout',
}

export default async function ChildTreePage({
  params,
}: {
  params: { childId: string }
}) {
  await requireParent()

  const [child, dashboardData] = await Promise.all([
    getChildById(params.childId),
    getChildDashboardData(params.childId),
  ])

  if (!child || !dashboardData) notFound()

  return (
    <ChildDashboard
      child={child}
      summary={dashboardData.summary}
      transactions={dashboardData.transactions}
      goals={dashboardData.goals}
      milestones={dashboardData.milestones}
    />
  )
}
