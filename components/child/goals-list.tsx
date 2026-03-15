import type { GoalWithProgress } from '@/types/domain'
import GoalCard from './goal-card'

// TODO: Implement goals list
// Renders a list of GoalCards; shows EmptyState if no goals exist
interface Props {
  childId: string
  goals: GoalWithProgress[]
}

export default function GoalsList({ childId, goals }: Props) {
  return null
}
