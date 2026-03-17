'use client'

import { useRouter } from 'next/navigation'
import AddMoneyForm from '@/components/parent/add-money-form'

interface Props {
  childId:    string
  redirectTo: string
}

export default function AddMoneyClient({ childId, redirectTo }: Props) {
  const router = useRouter()
  return (
    <AddMoneyForm
      childId={childId}
      onSuccess={() => router.push(redirectTo)}
    />
  )
}
