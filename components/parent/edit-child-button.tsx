'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import Dialog from '@/components/ui/dialog'
import EditChildForm from '@/components/parent/edit-child-form'
import type { Child } from '@/lib/db/types'

export default function EditChildButton({ child }: { child: Child }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Edit profile">
        <EditChildForm child={child} onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  )
}
