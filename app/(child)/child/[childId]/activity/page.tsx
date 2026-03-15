import type { Metadata } from 'next'
import ActivityList from '@/components/child/activity-list'

export const metadata: Metadata = {
  title: 'My Activity — CoinSprout',
}

// TODO: Fetch transactions server-side and pass to ActivityList
export default function ChildActivityPage({
  params,
}: {
  params: { childId: string }
}) {
  return <ActivityList transactions={[]} />
}
