'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { saveChildSettings } from '@/actions/child-settings'
import { DEFAULT_SETTINGS } from '@/lib/calculations/child-settings'
import type { ResolvedChildSettings } from '@/types/domain'

interface Props {
  childId:  string
  settings: ResolvedChildSettings
  /** When true renders as a collapsible card. When false renders fields directly. */
  accordion?: boolean
}

const ANIMAL_EMOJI = { bunny: '🐰', bird: '🐦', deer: '🦌', owl: '🦉', fox: '🦊' }

function SettingsInput({
  name, label, defaultValue, min = 1,
}: {
  name: string; label: string; defaultValue: number; min?: number
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={name} className="text-sm text-gray-600 min-w-0 flex-1">{label}</label>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm text-gray-400">$</span>
        <input
          id={name}
          name={name}
          type="number"
          min={min}
          step="1"
          defaultValue={defaultValue}
          required
          className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-right font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sprout-400"
        />
      </div>
    </div>
  )
}

function SubmitButton() {
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

function SettingsFields({ childId, settings, state }: {
  childId: string
  settings: ResolvedChildSettings
  state: { success: boolean; error?: string } | null
}) {
  return (
    <>
      <input type="hidden" name="childId" value={childId} />

      {/* ── Tree growth ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          🌱 Tree Growth (lifetime earnings)
        </h3>
        <div className="space-y-2.5">
          <SettingsInput name="treeYoung"   label="Young tree"   defaultValue={settings.treeThresholds.young} />
          <SettingsInput name="treeGrowing" label="Growing tree" defaultValue={settings.treeThresholds.growing} />
          <SettingsInput name="treeMature"  label="Mature tree"  defaultValue={settings.treeThresholds.mature} />
          <SettingsInput name="treeAncient" label="Ancient tree" defaultValue={settings.treeThresholds.ancient} />
        </div>
        <p className="text-xs text-gray-400">
          Defaults: ${DEFAULT_SETTINGS.treeThresholds.young} / ${DEFAULT_SETTINGS.treeThresholds.growing} / ${DEFAULT_SETTINGS.treeThresholds.mature} / ${DEFAULT_SETTINGS.treeThresholds.ancient}
        </p>
      </div>

      {/* ── Animal friends ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          🐾 Animal Friends (lifetime earnings)
        </h3>
        <div className="space-y-2.5">
          <SettingsInput name="milestoneBunny" label={`${ANIMAL_EMOJI.bunny} Bunny`} defaultValue={settings.milestoneThresholds.bunny} />
          <SettingsInput name="milestoneBird"  label={`${ANIMAL_EMOJI.bird} Bird`}   defaultValue={settings.milestoneThresholds.bird} />
          <SettingsInput name="milestoneDeer"  label={`${ANIMAL_EMOJI.deer} Deer`}   defaultValue={settings.milestoneThresholds.deer} />
          <SettingsInput name="milestoneOwl"   label={`${ANIMAL_EMOJI.owl} Owl`}     defaultValue={settings.milestoneThresholds.owl} />
          <SettingsInput name="milestoneFox"   label={`${ANIMAL_EMOJI.fox} Fox`}     defaultValue={settings.milestoneThresholds.fox} />
        </div>
        <p className="text-xs text-gray-400">
          Defaults: ${DEFAULT_SETTINGS.milestoneThresholds.bunny} / ${DEFAULT_SETTINGS.milestoneThresholds.bird} / ${DEFAULT_SETTINGS.milestoneThresholds.deer} / ${DEFAULT_SETTINGS.milestoneThresholds.owl} / ${DEFAULT_SETTINGS.milestoneThresholds.fox}
        </p>
      </div>

      {/* ── Fruit value ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          🍎 Apple Values
        </h3>
        <SettingsInput name="fruitBaseValue" label="Smallest apple worth" defaultValue={settings.fruitBaseValue} />
        <p className="text-xs text-gray-400">
          Other apples scale up proportionally. Default: ${DEFAULT_SETTINGS.fruitBaseValue} per apple.
        </p>
      </div>

      {state && !state.success && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-sprout-600 font-medium">Settings saved!</p>
      )}

      <SubmitButton />
    </>
  )
}

export default function ChildSettingsForm({ childId, settings, accordion = true }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action] = useFormState(saveChildSettings, null)

  if (!accordion) {
    return (
      <form action={action} className="space-y-6">
        <SettingsFields childId={childId} settings={settings} state={state} />
      </form>
    )
  }

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="font-semibold text-gray-800 text-sm">Visual Settings</p>
          <p className="text-xs text-gray-400 mt-0.5">Customise tree growth, animals, and apple values</p>
        </div>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <form action={action} className="px-5 pb-5 space-y-6 border-t border-gray-100 pt-4">
          <SettingsFields childId={childId} settings={settings} state={state} />
        </form>
      )}
    </div>
  )
}
