import type { Metadata } from 'next'
import GoalsList from '@/components/child/goals-list'

export const metadata: Metadata = {
  title: 'My Goals — CoinSprout',
}

// TODO: Fetch goals server-side and pass to GoalsList
export default function ChildGoalsPage({
  params,
}: {
  params: { childId: string }
}) {
  return <GoalsList childId={params.childId} goals={[]} />
}
