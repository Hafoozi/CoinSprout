'use client'

import { useRouter } from 'next/navigation'
import CreateGoalForm from '@/components/parent/create-goal-form'

interface Props {
  childId:    string
  redirectTo: string
}

export default function GoalNewClient({ childId, redirectTo }: Props) {
  const router = useRouter()
  return (
    <CreateGoalForm
      childId={childId}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}
