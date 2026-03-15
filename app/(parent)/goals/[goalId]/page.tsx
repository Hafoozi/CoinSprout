import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Goal — CoinSprout',
}

// TODO: Render goal detail / allocate form
export default function GoalPage({
  params,
}: {
  params: { goalId: string }
}) {
  return (
    <div className="p-6">
      <p className="text-sm text-gray-400">Goal — {params.goalId}</p>
    </div>
  )
}
