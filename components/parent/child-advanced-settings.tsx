'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { saveChildSettings } from '@/actions/child-settings'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'
import type { ResolvedChildSettings } from '@/types/domain'

interface Props {
  childId:    string
  settings:   ResolvedChildSettings
  hasPinHash: boolean
  onResetPin: () => void
}

// ─── Apple color definitions ───────────────────────────────────────────────
const APPLE_TIERS = [
  { color: 'green',     hex: '#16a34a', label: 'Green',     multiplier: 1,   description: 'Most common — everyday savings' },
  { color: 'red',       hex: '#dc2626', label: 'Red',       multiplier: 2,   description: 'Gifts and special earnings' },
  { color: 'silver',    hex: '#94a3b8', label: 'Silver',    multiplier: 4,   description: 'Growing quickly' },
  { color: 'gold',      hex: '#d97706', label: 'Gold',      multiplier: 50,  description: 'Big milestones' },
  { color: 'sparkling', hex: '#f59e0b', label: 'Sparkling', multiplier: 200, description: 'Legendary saver ⭐' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmt(n: number) {
  return '$' + (Number.isInteger(n) ? n : n.toFixed(2))
}

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
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={name} className="text-sm text-gray-600 flex-1">{label}</label>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm text-gray-400">$</span>
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
  const [open, setOpen] = useState({ pin: false, tree: false, animals: false, apples: false })
  const [baseValue, setBaseValue] = useState(settings.fruitBaseValue)
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

        {/* Keep apple base value in sync with local state */}
        <input type="hidden" name="fruitBaseValue" value={baseValue} />

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
              Defaults: ${DEFAULT_SETTINGS.treeThresholds.young} / ${DEFAULT_SETTINGS.treeThresholds.growing} / ${DEFAULT_SETTINGS.treeThresholds.mature} / ${DEFAULT_SETTINGS.treeThresholds.ancient}
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
              Defaults: ${DEFAULT_SETTINGS.milestoneThresholds.bunny} / ${DEFAULT_SETTINGS.milestoneThresholds.bird} / ${DEFAULT_SETTINGS.milestoneThresholds.deer} / ${DEFAULT_SETTINGS.milestoneThresholds.owl} / ${DEFAULT_SETTINGS.milestoneThresholds.fox}
            </p>
          </Section>

          {/* Apple Values */}
          <Section title="🍎 Apple Values" open={open.apples} onToggle={() => toggle('apples')}>
            <p className="text-xs text-gray-400 pb-1">
              Set what the smallest apple is worth. All other apple colors scale up from there.
            </p>

            {/* Base value input */}
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="fruitBaseValueInput" className="text-sm text-gray-600 flex-1">
                Smallest apple (green)
              </label>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-sm text-gray-400">$</span>
                <input
                  id="fruitBaseValueInput"
                  type="number"
                  min={1}
                  step={1}
                  value={baseValue}
                  onChange={(e) => setBaseValue(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sprout-400"
                />
              </div>
            </div>

            {/* Color legend */}
            <div className="rounded-xl bg-gray-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Apple color guide</p>
              {APPLE_TIERS.map(({ color, hex, label, multiplier, description }) => (
                <div key={color} className="flex items-center gap-3">
                  {/* Apple dot */}
                  <span
                    className="h-5 w-5 rounded-full shrink-0 border border-gray-200"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-xs text-gray-400 ml-1.5">— {description}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700 shrink-0 money">
                    {fmt(baseValue * multiplier)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Default smallest apple: ${DEFAULT_SETTINGS.fruitBaseValue}</p>
          </Section>

        </div>

        {/* Feedback */}
        {state && !state.success && (
          <p className="text-sm text-red-500 mt-3">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-sprout-600 font-medium mt-3">Settings saved!</p>
        )}

        <div className="mt-3">
          <SaveButton />
        </div>
      </form>
    </div>
  )
}
