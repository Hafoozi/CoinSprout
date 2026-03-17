'use client'

import { useRouter } from 'next/navigation'
import RecordSpendForm from '@/components/parent/record-spend-form'

interface Props {
  childId:    string
  redirectTo: string
}

export default function RecordSpendClient({ childId, redirectTo }: Props) {
  const router = useRouter()
  return (
    <RecordSpendForm
      childId={childId}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}
