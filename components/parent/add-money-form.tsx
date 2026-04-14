'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { addTransaction } from '@/actions/transactions'
import { useCurrency } from '@/components/providers/currency-provider'
import Button from '@/components/ui/button'
import CurrencyInput from '@/components/ui/currency-input'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'

const INITIAL = { success: false as const }

const SOURCE_OPTIONS = [
  { value: 'allowance', label: 'Allowance' },
  { value: 'gift',      label: 'Gift'      },
  { value: 'interest',  label: 'Interest'  },
  { value: 'jobs',      label: 'Jobs'      },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      Add Money
    </Button>
  )
}

interface Props {
  childId:   string
  onSuccess: () => void
}

export default function AddMoneyForm({ childId, onSuccess }: Props) {
  const currency = useCurrency()
  const [state, action] = useFormState(addTransaction, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={childId} />

      <CurrencyInput
        id="add-amount"
        name="amount"
        label="Amount"
        prefix={currency}
        placeholder="0.00"
        required
        error={state.error}
      />
      <Select
        id="add-source"
        name="source"
        label="Source"
        options={SOURCE_OPTIONS}
        defaultValue="allowance"
      />
      <Input
        id="add-note"
        name="note"
        label="Note (optional)"
        placeholder="e.g. Week 5 allowance"
        maxLength={100}
      />

      <SubmitButton />
    </form>
  )
}
