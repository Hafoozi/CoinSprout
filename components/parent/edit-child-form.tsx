'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { editChild } from '@/actions/children'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import type { Child } from '@/lib/db/types'

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
    <Button type="submit" className="w-full" isLoading={pending}>
      Save changes
    </Button>
  )
}

interface Props {
  child:     Child
  onSuccess: () => void
}

export default function EditChildForm({ child, onSuccess }: Props) {
  const [state, action] = useFormState(editChild, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={child.id} />

      <Input
        id="edit-name"
        name="name"
        label="Name"
        defaultValue={child.name}
        maxLength={30}
        required
      />
      <Input
        id="edit-birthdate"
        name="birthdate"
        type="date"
        label="Birthday (optional)"
        defaultValue={child.birthdate ?? ''}
      />
      <Select
        id="edit-avatar"
        name="avatarColor"
        label="Avatar color"
        options={AVATAR_OPTIONS}
        defaultValue={child.avatar_color ?? 'sprout'}
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
