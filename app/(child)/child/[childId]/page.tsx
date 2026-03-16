import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { getChildDashboardData } from '@/lib/db/queries/dashboards'

// Skip SSR — the dashboard uses localStorage and has no SEO value.
// This prevents hydration mismatches from data differences between children.
const ChildDashboard = dynamic(() => import('@/components/child/child-dashboard'), { ssr: false })

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
