'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'
import { verifyChildPin } from '@/actions/profile-switch'
import { ROUTES } from '@/lib/constants/routes'
import type { Child } from '@/lib/db/types'

interface ProfileSwitcherProps {
  children:     Child[]
  hasParentPin: boolean
  parentName:   string
}

type Mode =
  | { type: 'closed' }
  | { type: 'select' }
  | { type: 'enter-child-pin'; child: Child }

export default function ProfileSwitcher({ children, hasParentPin: _hasParentPin, parentName: _parentName }: ProfileSwitcherProps) {
  const router = useRouter()
  const [mode,      setMode]      = useState<Mode>({ type: 'closed' })
  const [error,     setError]     = useState<string>()
  const [isPending, startTransition] = useTransition()

  function close() {
    setMode({ type: 'closed' })
    setError(undefined)
  }

  function handleChildClick(child: Child) {
    if (child.pin_hash) {
      setError(undefined)
      setMode({ type: 'enter-child-pin', child })
    } else {
      close()
      router.push(ROUTES.CHILD.HOME(child.id))
    }
  }

  function handleChildPinEntry(child: Child, pin: string) {
    setError(undefined)
    startTransition(async () => {
      const result = await verifyChildPin(child.id, pin)
      if (result.success) {
        close()
        router.push(ROUTES.CHILD.HOME(child.id))
      } else {
        setError(result.error ?? 'Incorrect PIN')
      }
    })
  }

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setError(undefined); setMode({ type: 'select' }) }}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span>👤</span>
        <span>Switch</span>
      </button>

      {/* ── Profile selection dialog ── */}
      <Dialog open={mode.type === 'select'} onClose={close} title="Switch Profile">
        <div className="space-y-2">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => handleChildClick(child)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-sprout-50 hover:border-sprout-200 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sprout-100 text-sprout-700 font-bold text-sm">
                {child.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{child.name}</p>
                <p className="text-xs text-gray-400">{child.pin_hash ? 'PIN protected' : 'Child'}</p>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </button>
          ))}

          <div className="border-t border-gray-100 pt-2">
            <Link
              href={ROUTES.PARENT.SETTINGS}
              onClick={close}
              className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </Dialog>

      {/* ── Enter child PIN dialog ── */}
      {mode.type === 'enter-child-pin' && (
        <Dialog open={true} onClose={close} title={`Enter PIN for ${mode.child.name}`}>
          <PinPad
            title={`Enter ${mode.child.name}'s PIN`}
            subtitle="Enter the 4-digit PIN to access this profile"
            error={error}
            isLoading={isPending}
            onComplete={(pin) => handleChildPinEntry((mode as { type: 'enter-child-pin'; child: Child }).child, pin)}
          />
        </Dialog>
      )}
    </>
  )
}
