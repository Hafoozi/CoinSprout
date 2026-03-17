'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState } from 'react'
import { saveChildSettings } from '@/actions/child-settings'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'
import { useCurrency } from '@/components/providers/currency-provider'
import AppleIcon from '@/components/ui/apple-icon'
import type { ResolvedChildSettings } from '@/types/domain'

interface Props {
  childId:    string
  settings:   ResolvedChildSettings
  hasPinHash: boolean
  onResetPin: () => void
}

// ─── Apple color definitions ───────────────────────────────────────────────
const APPLE_COLORS: Array<{
  key:   keyof ResolvedChildSettings['fruitValues']
  field: string
  label: string
}> = [
  { key: 'green',     field: 'fruitGreenValue',    label: 'Green'     },
  { key: 'red',       field: 'fruitRedValue',       label: 'Red'       },
  { key: 'silver',    field: 'fruitSilverValue',    label: 'Silver'    },
  { key: 'gold',      field: 'fruitGoldValue',      label: 'Gold'      },
  { key: 'sparkling', field: 'fruitSparklingValue', label: 'Sparkling' },
]

// ─── Section accordion ───────────────────────────────────────────────────────
function Section({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

function NumberInput({ name, label, defaultValue }: { name: string; label: string; defaultValue: number }) {
  const currency = useCurrency()
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={name} className="text-sm text-gray-600 flex-1">{label}</label>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm text-gray-400">{currency}</span>
        <input
          id={name}
          name={name}
          type="number"
          min={1}
          step={1}
          defaultValue={defaultValue}
          required
          className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sprout-400"
        />
      </div>
    </div>
  )
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-sprout-500 hover:bg-sprout-600 disabled:opacity-50 text-white font-bold py-2.5 text-sm transition-colors"
    >
      {pending ? 'Saving…' : 'Save Settings'}
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ChildAdvancedSettings({ childId, settings, hasPinHash, onResetPin }: Props) {
  const currency        = useCurrency()
  const [open, setOpen] = useState({ pin: false, tree: false, animals: false, apples: false })
  const [state, action] = useFormState(saveChildSettings, null)

  function toggle(key: keyof typeof open) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-2">

      {/* ── PIN ── */}
      <Section title="🔒 PIN" open={open.pin} onToggle={() => toggle('pin')}>
        <p className="text-xs text-gray-400">
          {hasPinHash
            ? 'This child has a PIN set. Reset it here.'
            : 'No PIN set. Add one to protect this profile.'}
        </p>
        <button
          type="button"
          onClick={onResetPin}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left"
        >
          {hasPinHash ? '🔑 Reset PIN' : '🔑 Set PIN'}
        </button>
      </Section>

      {/* ── Settings form (tree + animals + apples) ── */}
      <form action={action}>
        <input type="hidden" name="childId" value={childId} />

        <div className="space-y-2">

          {/* Tree Growth */}
          <Section title="🌱 Tree Growth" open={open.tree} onToggle={() => toggle('tree')}>
            <p className="text-xs text-gray-400 pb-1">
              Set how much a child needs to earn (lifetime) for each tree stage.
            </p>
            <NumberInput name="treeYoung"   label="Young tree"   defaultValue={settings.treeThresholds.young} />
            <NumberInput name="treeGrowing" label="Growing tree" defaultValue={settings.treeThresholds.growing} />
            <NumberInput name="treeMature"  label="Mature tree"  defaultValue={settings.treeThresholds.mature} />
            <NumberInput name="treeAncient" label="Ancient tree" defaultValue={settings.treeThresholds.ancient} />
            <p className="text-xs text-gray-400 pt-1">
              Defaults: {currency}{DEFAULT_SETTINGS.treeThresholds.young} / {currency}{DEFAULT_SETTINGS.treeThresholds.growing} / {currency}{DEFAULT_SETTINGS.treeThresholds.mature} / {currency}{DEFAULT_SETTINGS.treeThresholds.ancient}
            </p>
          </Section>

          {/* Animal Friends */}
          <Section title="🐾 Animal Friends" open={open.animals} onToggle={() => toggle('animals')}>
            <p className="text-xs text-gray-400 pb-1">
              Set lifetime earnings required to unlock each animal.
            </p>
            <NumberInput name="milestoneBunny" label="🐰 Bunny" defaultValue={settings.milestoneThresholds.bunny} />
            <NumberInput name="milestoneBird"  label="🐦 Bird"  defaultValue={settings.milestoneThresholds.bird} />
            <NumberInput name="milestoneDeer"  label="🦌 Deer"  defaultValue={settings.milestoneThresholds.deer} />
            <NumberInput name="milestoneOwl"   label="🦉 Owl"   defaultValue={settings.milestoneThresholds.owl} />
            <NumberInput name="milestoneFox"   label="🦊 Fox"   defaultValue={settings.milestoneThresholds.fox} />
            <p className="text-xs text-gray-400 pt-1">
              Defaults: {currency}{DEFAULT_SETTINGS.milestoneThresholds.bunny} / {currency}{DEFAULT_SETTINGS.milestoneThresholds.bird} / {currency}{DEFAULT_SETTINGS.milestoneThresholds.deer} / {currency}{DEFAULT_SETTINGS.milestoneThresholds.owl} / {currency}{DEFAULT_SETTINGS.milestoneThresholds.fox}
            </p>
          </Section>

          {/* Apple Values */}
          <Section title="🍎 Apple Values" open={open.apples} onToggle={() => toggle('apples')}>
            <p className="text-xs text-gray-400 pb-1">
              Set what each apple color is worth in savings.
            </p>
            {APPLE_COLORS.map(({ key, field, label }) => {
              const hasError = state && !state.success && state.errorField === field
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1 -mx-2 transition-colors ${hasError ? 'bg-red-50 ring-1 ring-red-300' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <AppleIcon color={key} size={22} />
                    <label htmlFor={field} className="text-sm text-gray-600">{label}</label>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm text-gray-400">{currency}</span>
                    <input
                      id={field}
                      name={field}
                      type="number"
                      min={1}
                      step={1}
                      defaultValue={settings.fruitValues[key]}
                      required
                      className={`w-24 rounded-lg border px-2 py-1.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 ${hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-sprout-400'}`}
                    />
                  </div>
                </div>
              )
            })}
            {state && !state.success && APPLE_COLORS.some(({ field }) => field === state.errorField) && (
              <p className="text-xs text-red-500 pt-1">{state.error}</p>
            )}
            <p className="text-xs text-gray-400 pt-1">
              Defaults: {currency}{DEFAULT_SETTINGS.fruitValues.green} / {currency}{DEFAULT_SETTINGS.fruitValues.red} / {currency}{DEFAULT_SETTINGS.fruitValues.silver} / {currency}{DEFAULT_SETTINGS.fruitValues.gold} / {currency}{DEFAULT_SETTINGS.fruitValues.sparkling}
            </p>
          </Section>

        </div>

        {state && !state.success && !APPLE_COLORS.some(({ field }) => field === state.errorField) && (
          <p className="text-sm text-red-500 mt-3 px-1">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-sprout-600 font-medium mt-3 px-1">Settings saved!</p>
        )}

        <div className="mt-3">
          <SaveButton />
        </div>
      </form>
    </div>
  )
}
