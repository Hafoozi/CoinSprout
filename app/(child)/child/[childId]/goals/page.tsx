import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { toGoalWithProgress } from '@/lib/calculations/goals'
import GoalsList from '@/components/child/goals-list'

export const metadata: Metadata = {
  title: 'My Goals — CoinSprout',
}

export default async function ChildGoalsPage({
  params,
}: {
  params: { childId: string }
}) {
  await requireParent()

  const goals = (await getGoalsByChildId(params.childId)).map(toGoalWithProgress)

  return <GoalsList childId={params.childId} goals={goals} />
}
