'use client'

import { SOURCE_COLORS, SOURCE_LABELS } from '@/lib/constants/sources'
import type { SourceBreakdown } from '@/types/domain'
import type { IncomeSource } from '@/lib/constants/sources'

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────

interface Segment {
  key:   IncomeSource
  value: number
  hex:   string
  label: string
}

function DonutChart({
  segments,
  activeSource,
  onSegmentClick,
}: {
  segments:       Segment[]
  activeSource:   IncomeSource | null
  onSegmentClick: (key: IncomeSource | null) => void
}) {
  const r             = 36
  const cx            = 50
  const cy            = 50
  const circumference = 2 * Math.PI * r
  const total         = segments.reduce((s, seg) => s + seg.value, 0)

  if (total === 0) {
    return (
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="18" />
        <text x={cx} y={cy + 5} textAnchor="middle" className="text-xs fill-gray-400" fontSize="10">
          $0
        </text>
      </svg>
    )
  }

  let offset = 0
  const slices = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const dash  = (seg.value / total) * circumference
      const slice = { ...seg, dash, offset }
      offset += dash
      return slice
    })

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-28 h-28 -rotate-90 cursor-pointer"
      onClick={() => onSegmentClick(null)}
    >
      {slices.map((s, i) => {
        const isActive  = activeSource === null || activeSource === s.key
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.hex}
            strokeWidth={activeSource === s.key ? 22 : 18}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            opacity={isActive ? 1 : 0.25}
            style={{ transition: 'opacity 0.2s, stroke-width 0.15s' }}
            onClick={(e) => {
              e.stopPropagation()
              onSegmentClick(activeSource === s.key ? null : s.key)
            }}
          />
        )
      })}
    </svg>
  )
}

// ─── Legend row ───────────────────────────────────────────────────────────────

function LegendRow({
  sourceKey,
  label,
  amount,
  hex,
  percent,
  isActive,
  onClick,
}: {
  sourceKey: IncomeSource
  label:     string
  amount:    number
  hex:       string
  percent:   number
  isActive:  boolean
  onClick:   () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-2.5 rounded-md px-1 py-0.5 text-left transition-opacity',
        isActive ? 'opacity-100' : 'opacity-35',
      ].join(' ')}
    >
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: hex }}
      />
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-800 tabular-nums">
        ${amount.toFixed(2)}
      </span>
      <span className="w-10 text-right text-xs text-gray-400 tabular-nums">
        {percent.toFixed(0)}%
      </span>
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  breakdown:      SourceBreakdown
  activeSource:   IncomeSource | null
  onSegmentClick: (key: IncomeSource | null) => void
}

export default function SourceBreakdown({ breakdown, activeSource, onSegmentClick }: Props) {
  const sources = (
    ['allowance', 'gift', 'interest', 'jobs'] as const
  ).map((key) => ({
    key,
    label:  SOURCE_LABELS[key],
    amount: breakdown[key],
    hex:    SOURCE_COLORS[key].hex,
  }))

  const total = sources.reduce((s, src) => s + src.amount, 0)

  const segments: Segment[] = sources.map((s) => ({
    key:   s.key,
    value: Math.max(0, s.amount),
    hex:   s.hex,
    label: s.label,
  }))

  return (
    <div className="card-surface p-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Earnings Breakdown
        {activeSource && (
          <button
            type="button"
            onClick={() => onSegmentClick(null)}
            className="ml-2 normal-case font-normal text-sprout-600 hover:text-sprout-800"
          >
            × clear filter
          </button>
        )}
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="shrink-0">
          <DonutChart
            segments={segments}
            activeSource={activeSource}
            onSegmentClick={onSegmentClick}
          />
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1">
          {sources.map((src) => (
            <LegendRow
              key={src.key}
              sourceKey={src.key}
              label={src.label}
              amount={src.amount}
              hex={src.hex}
              percent={total > 0 ? (src.amount / total) * 100 : 0}
              isActive={activeSource === null || activeSource === src.key}
              onClick={() => onSegmentClick(activeSource === src.key ? null : src.key)}
            />
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between text-xs text-gray-500">
            <span>Total earned</span>
            <span className="font-semibold tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
