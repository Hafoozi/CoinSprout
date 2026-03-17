'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Dialog from '@/components/ui/dialog'
import PinPad from '@/components/ui/pin-pad'
import ChildAdvancedSettings from '@/components/parent/child-advanced-settings'
import { setChildPin, setParentPin, verifyChildPin, verifyParentPin } from '@/actions/profile-switch'
import { ROUTES } from '@/lib/constants/routes'
import type { Child } from '@/lib/db/types'
import type { ResolvedChildSettings } from '@/types/domain'

interface ProfileSwitcherProps {
  children:     Child[]
  hasParentPin: boolean
  parentName:   string
  settingsMap:  Record<string, ResolvedChildSettings>
}

type Mode =
  | { type: 'closed' }
  | { type: 'select' }
  | { type: 'enter-child-pin';  child: Child }
  | { type: 'set-child-pin';    child: Child; step: 'enter' | 'confirm'; first?: string }
  | { type: 'reset-child-pin';  child: Child; step: 'enter' | 'confirm'; first?: string }
  | { type: 'set-parent-pin';   step: 'enter' | 'confirm'; first?: string }
  | { type: 'child-settings';   child: Child }

export default function ProfileSwitcher({ children, hasParentPin, parentName: _parentName, settingsMap }: ProfileSwitcherProps) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>({ type: 'closed' })
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  function close() {
    setMode({ type: 'closed' })
    setError(undefined)
  }

  function handleChildSelect(child: Child) {
    close()
    router.push(ROUTES.CHILD.HOME(child.id))
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

  function handleSetChildPin(child: Child, step: 'enter' | 'confirm', first: string | undefined, pin: string) {
    setError(undefined)
    if (step === 'enter') {
      setMode({ type: 'set-child-pin', child, step: 'confirm', first: pin })
    } else {
      if (pin !== first) {
        setError('PINs do not match — try again')
        setMode({ type: 'set-child-pin', child, step: 'enter' })
        return
      }
      startTransition(async () => {
        const result = await setChildPin(child.id, pin)
        if (result.success) {
          close()
          router.push(ROUTES.CHILD.HOME(child.id))
        } else {
          setError(result.error ?? 'Failed to set PIN')
        }
      })
    }
  }

  function handleSetParentPin(step: 'enter' | 'confirm', first: string | undefined, pin: string) {
    setError(undefined)
    if (step === 'enter') {
      setMode({ type: 'set-parent-pin', step: 'confirm', first: pin })
    } else {
      if (pin !== first) {
        setError('PINs do not match — try again')
        setMode({ type: 'set-parent-pin', step: 'enter' })
        return
      }
      startTransition(async () => {
        const result = await setParentPin(pin)
        if (result.success) {
          close()
        } else {
          setError(result.error ?? 'Failed to set PIN')
        }
      })
    }
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

          {/* Children */}
          {children.map((child) => (
            <div key={child.id} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 hover:bg-sprout-50 hover:border-sprout-200 transition-colors">
              <button
                type="button"
                onClick={() => handleChildSelect(child)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sprout-100 text-sprout-700 font-bold text-sm">
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{child.name}</p>
                  <p className="text-xs text-gray-400">Child</p>
                </div>
                <span className="ml-auto text-gray-300">›</span>
              </button>

              {/* Advanced settings button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setError(undefined); setMode({ type: 'child-settings', child }) }}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-sprout-600 hover:bg-sprout-50 transition-colors"
                title="Advanced settings"
              >
                ⚙️
              </button>
            </div>
          ))}

          {/* Parent PIN settings */}
          <div className="border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={() => { setError(undefined); setMode({ type: 'set-parent-pin', step: 'enter' }) }}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors text-left"
            >
              🔑 {hasParentPin ? 'Change parent PIN' : 'Set parent PIN'}
            </button>
          </div>
        </div>
      </Dialog>

      {/* ── Child advanced settings dialog ── */}
      {mode.type === 'child-settings' && (
        <Dialog
          open={true}
          onClose={() => { close(); setMode({ type: 'select' }) }}
          title={`${mode.child.name}'s Settings`}
        >
          <ChildAdvancedSettings
            childId={mode.child.id}
            settings={settingsMap[mode.child.id]}
            hasPinHash={!!mode.child.pin_hash}
            onResetPin={() => {
              setError(undefined)
              setMode({ type: mode.child.pin_hash ? 'reset-child-pin' : 'set-child-pin', child: (mode as { child: Child }).child, step: 'enter' })
            }}
          />
        </Dialog>
      )}

      {/* ── Set child PIN dialog ── */}
      {mode.type === 'set-child-pin' && (
        <Dialog open={true} onClose={close} title={`Set PIN for ${mode.child.name}`}>
          <PinPad
            title={mode.step === 'enter' ? `Choose a 4-digit PIN for ${mode.child.name}` : 'Confirm the PIN'}
            subtitle={mode.step === 'enter' ? 'Your child will use this to access their account' : 'Enter the same PIN again'}
            error={error}
            isLoading={isPending}
            onComplete={(pin) => handleSetChildPin(mode.child, mode.step, mode.first, pin)}
          />
        </Dialog>
      )}

      {/* ── Reset child PIN dialog ── */}
      {mode.type === 'reset-child-pin' && (
        <Dialog open={true} onClose={() => { close(); setMode({ type: 'select' }) }} title={`Reset PIN for ${mode.child.name}`}>
          <PinPad
            title={mode.step === 'enter' ? `Choose a new PIN for ${mode.child.name}` : 'Confirm the new PIN'}
            subtitle={mode.step === 'enter' ? 'This will replace the existing PIN' : 'Enter the same PIN again'}
            error={error}
            isLoading={isPending}
            onComplete={(pin) => handleSetChildPin(mode.child, mode.step, mode.first, pin)}
          />
        </Dialog>
      )}

      {/* ── Set parent PIN dialog ── */}
      {mode.type === 'set-parent-pin' && (
        <Dialog open={true} onClose={close} title="Parent PIN">
          <PinPad
            title={mode.step === 'enter' ? 'Choose a 4-digit parent PIN' : 'Confirm the PIN'}
            subtitle={mode.step === 'enter' ? 'Used to return to parent view from a child profile' : 'Enter the same PIN again'}
            error={error}
            isLoading={isPending}
            onComplete={(pin) => handleSetParentPin(mode.step, mode.first, pin)}
          />
        </Dialog>
      )}
    </>
  )
}
