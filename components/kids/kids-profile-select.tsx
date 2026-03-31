'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'
import { verifyChildPin } from '@/actions/profile-switch'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'

interface ChildEntry {
  id:         string
  name:       string
  avatarColor: string | null
  hasPin:     boolean
}

interface Props {
  children: ChildEntry[]
}

export default function KidsProfileSelect({ children }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState<ChildEntry | null>(null)
  const [error,    setError]    = useState<string | undefined>()

  // Single child with a PIN — open the dialog automatically on mount
  useEffect(() => {
    if (children.length === 1 && children[0].hasPin) {
      setSelected(children[0])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(child: ChildEntry) {
    if (!child.hasPin) {
      router.push(ROUTES.CHILD.HOME(child.id))
      return
    }
    setError(undefined)
    setSelected(child)
  }

  function handleClose() {
    if (pending) return
    setSelected(null)
    setError(undefined)
  }

  function handlePin(pin: string) {
    if (!selected) return
    startTransition(async () => {
      const result = await verifyChildPin(selected.id, pin)
      if (result.success) {
        router.push(ROUTES.CHILD.HOME(selected.id))
      } else {
        setError(result.error ?? 'Incorrect PIN')
      }
    })
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {children.map((child) => {
          const colorClass = AVATAR_BG[child.avatarColor ?? 'sprout'] ?? AVATAR_BG.sprout
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => handleSelect(child)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-white/60 active:scale-95 transition-all"
            >
              <div className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl font-bold ${colorClass}`}>
                {child.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-semibold text-gray-700">{child.name}</span>
            </button>
          )
        })}
      </div>

      <Dialog
        open={!!selected}
        onClose={handleClose}
        title={selected ? `Hi, ${selected.name}!` : ''}
      >
        {selected && (
          <PinPad
            title="Enter your PIN"
            subtitle="4-digit passcode"
            error={error}
            isLoading={pending}
            onComplete={handlePin}
          />
        )}
      </Dialog>
    </>
  )
}
