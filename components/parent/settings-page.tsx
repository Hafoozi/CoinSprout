'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveCurrencySettings } from '@/actions/family-settings'
import { setChildPin, setParentPin } from '@/actions/profile-switch'
import ChildAdvancedSettings from '@/components/parent/child-advanced-settings'
import RecurringAllowanceForm from '@/components/parent/recurring-allowance-form'
import PinPad from '@/components/ui/pin-pad'
import Dialog from '@/components/ui/dialog'
import { CURRENCY_OPTIONS } from '@/lib/constants/currencies'
import { ROUTES } from '@/lib/constants/routes'
import type { Child, CurrencySymbol, RecurringAllowance } from '@/lib/db/types'
import type { ResolvedChildSettings } from '@/types/domain'

// ─── Types ───────────────────────────────────────────────────────────────────

type PinMode =
  | { type: 'closed' }
  | { type: 'set-child-pin';   child: Child; step: 'enter' | 'confirm'; first?: string }
  | { type: 'reset-child-pin'; child: Child; step: 'enter' | 'confirm'; first?: string }
  | { type: 'set-parent-pin';  step: 'enter' | 'confirm'; first?: string }

interface Props {
  currency:     CurrencySymbol
  hasParentPin: boolean
  children:     Child[]
  settingsMap:  Record<string, ResolvedChildSettings>
  allowanceMap: Record<string, RecurringAllowance | null>
}

// ─── Save button (needs useFormStatus inside the form) ───────────────────────

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-sprout-500 hover:bg-sprout-600 disabled:opacity-50 text-white font-bold px-5 py-2 text-sm transition-colors"
    >
      {pending ? 'Saving…' : 'Save'}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsPage({ currency, hasParentPin, children, settingsMap, allowanceMap }: Props) {
  const router = useRouter()
  const [currencyState, currencyAction] = useFormState(saveCurrencySettings, null)
  const [pinMode,    setPinMode]    = useState<PinMode>({ type: 'closed' })
  const [pinError,   setPinError]   = useState<string>()
  const [openChild,  setOpenChild]  = useState<string | null>(null)
  const [isPending,  startTransition] = useTransition()

  function closePinDialog() {
    setPinMode({ type: 'closed' })
    setPinError(undefined)
  }

  function handleSetChildPin(child: Child, step: 'enter' | 'confirm', first: string | undefined, pin: string) {
    setPinError(undefined)
    if (step === 'enter') {
      setPinMode({ type: 'set-child-pin', child, step: 'confirm', first: pin })
      return
    }
    if (pin !== first) {
      setPinError('PINs do not match — try again')
      setPinMode({ type: 'set-child-pin', child, step: 'enter' })
      return
    }
    startTransition(async () => {
      const result = await setChildPin(child.id, pin)
      if (result.success) {
        closePinDialog()
        router.refresh()
      } else {
        setPinError(result.error ?? 'Failed to set PIN')
      }
    })
  }

  function handleSetParentPin(step: 'enter' | 'confirm', first: string | undefined, pin: string) {
    setPinError(undefined)
    if (step === 'enter') {
      setPinMode({ type: 'set-parent-pin', step: 'confirm', first: pin })
      return
    }
    if (pin !== first) {
      setPinError('PINs do not match — try again')
      setPinMode({ type: 'set-parent-pin', step: 'enter' })
      return
    }
    startTransition(async () => {
      const result = await setParentPin(pin)
      if (result.success) {
        closePinDialog()
        router.refresh()
      } else {
        setPinError(result.error ?? 'Failed to set PIN')
      }
    })
  }

  return (
    <div className="py-3 space-y-4">
      <Link href={ROUTES.PARENT.DASHBOARD} className="inline-flex items-center gap-1 text-sm text-sprout-600 hover:text-sprout-800 transition-colors">
        ← Parent
      </Link>
      <h1 className="text-xl font-bold text-gray-800">Settings</h1>

      {/* ── Currency ─────────────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Currency</h2>
        <div className="card-surface p-4">
          <form action={currencyAction} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="currencySymbol" className="text-sm font-medium text-gray-700">
                Currency symbol
              </label>
              <select
                id="currencySymbol"
                name="currencySymbol"
                defaultValue={currency}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sprout-300"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.symbol} value={opt.symbol}>
                    {opt.symbol} — {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {currencyState && !currencyState.success && (
              <p className="text-sm text-red-500">{currencyState.error}</p>
            )}
            {currencyState?.success && (
              <p className="text-sm text-sprout-600 font-medium">Saved!</p>
            )}
            <div className="flex justify-end">
              <SaveButton />
            </div>
          </form>
        </div>
      </section>

      {/* ── Security / PINs ──────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Security</h2>
        <div className="card-surface divide-y divide-gray-100">

          {/* Parent PIN */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">Parent PIN</p>
              <p className="text-xs text-gray-400">
                {hasParentPin ? 'Set — protects the parent view' : 'Not set'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setPinError(undefined); setPinMode({ type: 'set-parent-pin', step: 'enter' }) }}
              className="shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              🔑 {hasParentPin ? 'Change' : 'Set PIN'}
            </button>
          </div>

          {/* Per-child PINs */}
          {children.map((child) => (
            <div key={child.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{child.name}'s PIN</p>
                <p className="text-xs text-gray-400">
                  {child.pin_hash ? 'Set — required to access their profile' : 'Not set'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPinError(undefined)
                  setPinMode(child.pin_hash
                    ? { type: 'reset-child-pin', child, step: 'enter' }
                    : { type: 'set-child-pin',   child, step: 'enter' }
                  )
                }}
                className="shrink-0 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                🔑 {child.pin_hash ? 'Change' : 'Set PIN'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Export ───────────────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Export</h2>
        <div className="card-surface p-4 space-y-2">
          <p className="text-sm text-gray-600">
            Download all transactions and savings data as an Excel spreadsheet.
            Includes a summary sheet plus a sheet per child.
          </p>
          <a
            href="/api/export"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-sprout-500 hover:bg-sprout-600 text-white font-bold px-5 py-2.5 text-sm transition-colors"
          >
            📥 Download Excel
          </a>
        </div>
      </section>

      {/* ── Advanced Settings (per child) ────────────────────────────────── */}
      {children.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Advanced</h2>
          <div className="space-y-2">
            {children.map((child) => (
              <div key={child.id} className="card-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenChild(openChild === child.id ? null : child.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sprout-100 text-sprout-700 font-bold text-sm">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{child.name}</span>
                  </div>
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${openChild === child.id ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openChild === child.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 pb-1">💵 Allowance</p>
                      <RecurringAllowanceForm
                        childId={child.id}
                        existing={allowanceMap[child.id]}
                      />
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <ChildAdvancedSettings
                        childId={child.id}
                        settings={settingsMap[child.id]}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PIN Dialogs ───────────────────────────────────────────────────── */}
      {pinMode.type === 'set-child-pin' && (
        <Dialog open={true} onClose={closePinDialog} title={`Set PIN for ${pinMode.child.name}`}>
          <PinPad
            title={pinMode.step === 'enter' ? `Choose a 4-digit PIN for ${pinMode.child.name}` : 'Confirm the PIN'}
            subtitle={pinMode.step === 'enter' ? 'Your child will use this to access their profile' : 'Enter the same PIN again'}
            error={pinError}
            isLoading={isPending}
            onComplete={(pin) => handleSetChildPin(pinMode.child, pinMode.step, pinMode.first, pin)}
          />
        </Dialog>
      )}

      {pinMode.type === 'reset-child-pin' && (
        <Dialog open={true} onClose={closePinDialog} title={`Reset PIN for ${pinMode.child.name}`}>
          <PinPad
            title={pinMode.step === 'enter' ? `Choose a new PIN for ${pinMode.child.name}` : 'Confirm the new PIN'}
            subtitle={pinMode.step === 'enter' ? 'This will replace the existing PIN' : 'Enter the same PIN again'}
            error={pinError}
            isLoading={isPending}
            onComplete={(pin) => handleSetChildPin(pinMode.child, pinMode.step, pinMode.first, pin)}
          />
        </Dialog>
      )}

      {pinMode.type === 'set-parent-pin' && (
        <Dialog open={true} onClose={closePinDialog} title="Parent PIN">
          <PinPad
            title={pinMode.step === 'enter' ? 'Choose a 4-digit parent PIN' : 'Confirm the PIN'}
            subtitle={pinMode.step === 'enter' ? 'Used to return to parent view from a child profile' : 'Enter the same PIN again'}
            error={pinError}
            isLoading={isPending}
            onComplete={(pin) => handleSetParentPin(pinMode.step, pinMode.first, pin)}
          />
        </Dialog>
      )}
    </div>
  )
}
