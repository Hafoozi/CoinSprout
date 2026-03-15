'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import Dialog from '@/components/ui/dialog'
import AddMoneyForm from '@/components/parent/add-money-form'
import RecordSpendForm from '@/components/parent/record-spend-form'
import CreateGoalForm from '@/components/parent/create-goal-form'
import AllocateGoalForm from '@/components/parent/allocate-goal-form'
import type { GoalWithProgress } from '@/types/domain'

type OpenDialog = 'addMoney' | 'spend' | 'createGoal' | 'allocate' | null

interface Props {
  childId:   string
  goals:     GoalWithProgress[]
  freeToUse: number
}

export default function QuickActions({ childId, goals, freeToUse }: Props) {
  const [open, setOpen] = useState<OpenDialog>(null)
  const close = () => setOpen(null)

  const incompleteGoals = goals.filter((g) => !g.isComplete)
  const canAllocate     = incompleteGoals.length > 0 && freeToUse > 0

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setOpen('addMoney')}>
          + Add Money
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen('spend')}>
          Record Spending
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen('createGoal')}>
          New Goal
        </Button>
        {canAllocate && (
          <Button size="sm" variant="secondary" onClick={() => setOpen('allocate')}>
            Allocate to Goal
          </Button>
        )}
      </div>

      <Dialog open={open === 'addMoney'} onClose={close} title="Add Money">
        <AddMoneyForm childId={childId} onSuccess={close} />
      </Dialog>

      <Dialog open={open === 'spend'} onClose={close} title="Record Spending">
        <RecordSpendForm childId={childId} onSuccess={close} />
      </Dialog>

      <Dialog open={open === 'createGoal'} onClose={close} title="Create Goal">
        <CreateGoalForm childId={childId} onSuccess={close} />
      </Dialog>

      <Dialog open={open === 'allocate'} onClose={close} title="Allocate to Goal">
        <AllocateGoalForm
          goals={incompleteGoals}
          freeToUse={freeToUse}
          onSuccess={close}
        />
      </Dialog>
    </>
  )
}
