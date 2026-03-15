'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addChild } from '@/actions/children'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { ROUTES } from '@/lib/constants/routes'

const AVATAR_OPTIONS = [
  { value: 'sprout', label: '🌱 Green (Sprout)' },
  { value: 'sky',    label: '🔵 Blue (Sky)'     },
  { value: 'gold',   label: '🌟 Yellow (Gold)'  },
  { value: 'rose',   label: '🌸 Pink (Rose)'    },
  { value: 'violet', label: '💜 Purple (Violet)'},
  { value: 'orange', label: '🍊 Orange'         },
]

const INITIAL = { success: false as const }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" isLoading={pending}>
      Add child
    </Button>
  )
}

export default function CreateChildForm() {
  const router = useRouter()
  const [state, action] = useFormState(addChild, INITIAL)

  useEffect(() => {
    if (state.success) {
      router.push(ROUTES.PARENT.DASHBOARD)
    }
  }, [state, router])

  return (
    <form action={action} className="space-y-5">
      <Input
        id="name"
        name="name"
        label="Child's name"
        placeholder="e.g. Emma"
        maxLength={30}
        required
      />
      <Input
        id="birthdate"
        name="birthdate"
        type="date"
        label="Birthday (optional)"
      />
      <Select
        id="avatarColor"
        name="avatarColor"
        label="Avatar color"
        options={AVATAR_OPTIONS}
        defaultValue="sprout"
      />
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  )
}
