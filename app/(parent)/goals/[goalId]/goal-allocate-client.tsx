'use client'

import { useRouter } from 'next/navigation'
import AllocateGoalForm from '@/components/parent/allocate-goal-form'
import type { GoalWithProgress } from '@/types/domain'

interface Props {
  goals:      GoalWithProgress[]
  freeToUse:  number
  redirectTo: string
}

export default function GoalAllocateClient({ goals, freeToUse, redirectTo }: Props) {
  const router = useRouter()
  return (
    <AllocateGoalForm
      goals={goals}
      freeToUse={freeToUse}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}
