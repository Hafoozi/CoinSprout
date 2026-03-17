import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { getChildDashboardData } from '@/lib/db/queries/dashboards'
import SavingsSummary from '@/components/child/savings-summary'
import ActivitySection from '@/components/child/activity-section'
import GoalActions from '@/components/parent/goal-actions'
import QuickActions from '@/components/parent/quick-actions'
import EditChildButton from '@/components/parent/edit-child-button'
import { ROUTES } from '@/lib/constants/routes'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'

export const metadata: Metadata = {
  title: 'Child Profile — CoinSprout',
}


export default async function ChildProfilePage({
  params,
}: {
  params: { childId: string }
}) {
  await requireParent()

  // Fetch child profile and full financial data in parallel
  const [child, dashboardData] = await Promise.all([
    getChildById(params.childId),
    getChildDashboardData(params.childId),
  ])

  // RLS will have returned null if the child doesn't belong to this parent
  if (!child || !dashboardData) notFound()

  const { summary, transactions, goals, settings } = dashboardData
  const colorClass = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout

  return (
    <div className="space-y-6 py-6">

      {/* Back navigation */}
      <Link
        href={ROUTES.PARENT.DASHBOARD}
        className="inline-flex items-center gap-1 text-sm text-sprout-600 hover:text-sprout-800 transition-colors"
      >
        ← Dashboard
      </Link>

      {/* Child identity */}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${colorClass}`}
        >
          {child.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800">{child.name}</h1>
          {child.birthdate && (
            <p className="text-sm text-gray-400">
              Born{' '}
              {new Date(child.birthdate + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'long',
                day:   'numeric',
                year:  'numeric',
              })}
            </p>
          )}
        </div>
        <EditChildButton child={child} />
      </div>

      {/* Financial summary strip */}
      <SavingsSummary summary={summary} />

      {/* Action buttons — client component managing dialogs */}
      <QuickActions
        childId={child.id}
        goals={goals}
        freeToUse={summary.freeToUse}
      />

      {/* Goals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Goals{goals.length > 0 && ` (${goals.length})`}
          </h2>
        </div>

        {goals.length === 0 ? (
          <div className="card-surface py-8 text-center text-sm text-gray-400">
            No goals yet — tap <strong>New Goal</strong> above to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <GoalActions key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive earnings chart + filterable/sortable activity list */}
      <ActivitySection
        transactions={transactions}
        breakdown={summary.sourceBreakdown}
        childId={child.id}
      />

    </div>
  )
}
