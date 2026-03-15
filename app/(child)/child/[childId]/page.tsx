import type { Metadata } from 'next'
import ChildDashboard from '@/components/child/child-dashboard'

export const metadata: Metadata = {
  title: 'My Tree — CoinSprout',
}

// TODO: Fetch child data server-side and pass to ChildDashboard
export default function ChildTreePage({
  params,
}: {
  params: { childId: string }
}) {
  return <ChildDashboard childId={params.childId} />
}
