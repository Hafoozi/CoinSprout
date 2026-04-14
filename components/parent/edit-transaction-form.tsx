'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect } from 'react'
import { editTransaction } from '@/actions/transactions'
import { useCurrency } from '@/components/providers/currency-provider'
import Button from '@/components/ui/button'
import CurrencyInput from '@/components/ui/currency-input'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { SOURCE_LABELS } from '@/lib/constants/sources'
import type { Transaction } from '@/types/database'

const SOURCE_OPTIONS = [
  { value: 'allowance', label: SOURCE_LABELS.allowance },
  { value: 'gift',      label: SOURCE_LABELS.gift      },
  { value: 'interest',  label: SOURCE_LABELS.interest  },
  { value: 'jobs',      label: SOURCE_LABELS.jobs      },
  { value: 'spend',     label: SOURCE_LABELS.spend     },
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
  transaction: Transaction
  childId:     string
  onSuccess:   () => void
}

export default function EditTransactionForm({ transaction, childId, onSuccess }: Props) {
  const currency = useCurrency()
  const [state, action] = useFormState(editTransaction, INITIAL)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  // Parse the date from created_at for the date input (YYYY-MM-DD)
  const defaultDate = transaction.created_at.slice(0, 10)
  // Amount shown as absolute value; sign is determined by source on save
  const defaultAmount = Math.abs(transaction.amount)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="transactionId" value={transaction.id} />
      <input type="hidden" name="childId" value={childId} />

      <Select
        id="edit-tx-source"
        name="source"
        label="Type"
        options={SOURCE_OPTIONS}
        defaultValue={transaction.source}
      />

      <CurrencyInput
        id="edit-tx-amount"
        name="amount"
        label="Amount"
        prefix={currency}
        defaultValue={defaultAmount}
        required
      />

      <Input
        id="edit-tx-date"
        name="date"
        type="date"
        label="Date"
        defaultValue={defaultDate}
      />

      <Input
        id="edit-tx-note"
        name="note"
        label="Note (optional)"
        defaultValue={transaction.note ?? ''}
        maxLength={100}
      />

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
