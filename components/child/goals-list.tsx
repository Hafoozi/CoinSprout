import type { GoalWithProgress } from '@/types/domain'
import GoalCard from './goal-card'

interface Props {
  childId: string
  goals: GoalWithProgress[]
}

export default function GoalsList({ childId: _childId, goals }: Props) {
  const incomplete = goals.filter((g) => !g.isComplete)
  const complete   = goals.filter((g) => g.isComplete)

  if (goals.length === 0) {
    return (
      <div className="py-12 text-center space-y-2">
        <p className="text-4xl">🎯</p>
        <p className="font-semibold text-gray-600">No goals yet</p>
        <p className="text-sm text-gray-400">Ask a parent to set up a goal for you!</p>
      </div>
    )
  }

  return (
    <div className="py-4 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">My Goals</h1>

      {incomplete.length > 0 && (
        <div className="space-y-3">
          {incomplete.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {complete.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">
            Completed
          </h2>
          {complete.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
