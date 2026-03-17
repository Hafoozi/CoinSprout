'use client'

import type { Child } from '@/lib/db/types'
import type { ChildFinancialSummary, GoalWithProgress, ResolvedChildSettings } from '@/types/domain'
import type { Transaction } from '@/lib/db/types'
import TreeHero from '@/components/tree/tree-hero'
import TransactionNotifications from '@/components/child/transaction-notifications'
import { calculateTreeStage } from '@/lib/calculations/tree-stage'
import { calculateFruitClusters } from '@/lib/calculations/fruit'
import { getNextMilestone, amountToNextMilestone, getEarnedMilestones } from '@/lib/calculations/milestones'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'
import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'

interface Props {
  child:        Child
  summary:      ChildFinancialSummary
  transactions: Transaction[]
  goals:        GoalWithProgress[]
  settings:     ResolvedChildSettings
}


function fmt(n: number) {
  return '$' + Math.abs(n).toFixed(2)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const ANIMAL_EMOJI: Record<MilestoneType, string> = {
  bunny: '🐰', bird: '🐦', deer: '🦌', owl: '🦉', fox: '🦊',
}

const APPLE_COLOR_HEX: Record<string, string> = {
  green:     '#16a34a',
  red:       '#dc2626',
  silver:    '#dde8f0',
  gold:      '#d97706',
  sparkling: '#f8fafc',
}

function AppleDot({ color }: { color: string }) {
  const fill = APPLE_COLOR_HEX[color] ?? '#16a34a'
  const isSparkling = color === 'sparkling'
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* Stem */}
      <path d="M9 3 Q9.5 0.5 11.5 2" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M9 3 Q13 0 14.5 3.5" stroke="#16a34a" strokeWidth="1.2" fill="#22c55e"/>
      {/* Round body */}
      <circle cx="9" cy="12" r="7.5" fill={fill} stroke={isSparkling ? '#f59e0b' : 'none'} strokeWidth={isSparkling ? 1 : 0}/>
      {/* Top cleft */}
      <path d="M6 5.5 Q9 4.5 12 5.5" fill="none" stroke={isSparkling ? 'rgba(245,158,11,0.3)' : 'rgba(0,0,0,0.13)'} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Highlight or star */}
      {isSparkling
        ? <text x="9" y="16.5" textAnchor="middle" fontSize="11" fill="#f59e0b">★</text>
        : <circle cx="5.5" cy="9" r="2" fill="white" opacity="0.35"/>
      }
    </svg>
  )
}

export default function ChildDashboard({ child, summary, transactions, goals, settings }: Props) {
  const stage         = calculateTreeStage(summary.lifetimeEarnings, settings.treeThresholds)
  const fruitClusters = calculateFruitClusters(summary.savingsBalance, settings.fruitBaseValue)
  const unlockedTypes = getEarnedMilestones(summary.lifetimeEarnings, settings.milestoneThresholds)
  const nextMilestone = getNextMilestone(summary.lifetimeEarnings, settings.milestoneThresholds)
  const amountToNext  = amountToNextMilestone(summary.lifetimeEarnings, settings.milestoneThresholds)
  const colorClass    = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout
  const milestoneProgress = nextMilestone
    ? Math.round(((nextMilestone.threshold - amountToNext) / nextMilestone.threshold) * 100)
    : 100
  const incompleteGoals = goals.filter((g) => !g.isComplete)

  return (
    <div className="py-4 space-y-6">

      {/* Fund notifications */}
      <TransactionNotifications childId={child.id} transactions={transactions}/>

      {/* Child header */}
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${colorClass}`}>
          {child.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{child.name}'s Tree</h1>
          <p className="text-sm text-sprout-600 capitalize">{stage} tree</p>
        </div>
      </div>

      {/* ── Responsive two-column on desktop ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* LEFT — tree */}
        <div className="card-surface overflow-hidden">
          <TreeHero
            stage={stage}
            fruitClusters={fruitClusters}
            unlockedMilestones={unlockedTypes}
            childId={child.id}
          />
        </div>

        {/* RIGHT — info panels */}
        <div className="space-y-4">

          {/* Savings balance */}
          <div className="card-surface p-5 text-center space-y-1">
            <p className="text-sm text-gray-500 font-medium">My Savings</p>
            <p className="text-4xl font-bold text-sprout-700 money">{fmt(summary.savingsBalance)}</p>
            <p className="text-xs text-gray-400">Free to use: {fmt(summary.freeToUse)}</p>
            <p className="text-xs text-gray-400">Lifetime earned: {fmt(summary.lifetimeEarnings)}</p>
          </div>

          {/* Next milestone progress */}
          {nextMilestone ? (
            <div className="card-surface p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Next friend: {ANIMAL_EMOJI[nextMilestone.type]} {nextMilestone.label}
                </span>
                <span className="text-gray-400">{fmt(amountToNext)} to go</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sprout-400 transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="card-surface p-4 text-center space-y-1">
              <p className="text-2xl">🎉</p>
              <p className="font-semibold text-sprout-700">All friends unlocked!</p>
            </div>
          )}

          {/* Goals */}
          {incompleteGoals.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">My Goals</h2>
              {incompleteGoals.map((goal) => (
                <div key={goal.id} className="card-surface p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-gray-800">{goal.name}</p>
                    <p className="text-gray-500">{fmt(goal.allocatedAmount)} / {fmt(goal.targetPrice)}</p>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{goal.progressPercent}% saved</p>
                </div>
              ))}
            </div>
          )}

          {/* My Savings breakdown */}
          <div className="card-surface p-4 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Where it came from</h2>
            <div className="space-y-1.5">
              {(
                [
                  { key: 'allowance', label: 'Allowance', icon: '💵' },
                  { key: 'gift',      label: 'Gifts',     icon: '🎁' },
                  { key: 'interest',  label: 'Interest',  icon: '📈' },
                  { key: 'jobs',      label: 'Jobs',      icon: '⭐' },
                ] as const
              )
                .filter(({ key }) => summary.sourceBreakdown[key] > 0)
                .sort((a, b) => {
                  const diff = summary.sourceBreakdown[b.key] - summary.sourceBreakdown[a.key]
                  return diff !== 0 ? diff : a.label.localeCompare(b.label)
                })
                .map(({ key, label, icon }) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-gray-600">{label}</span>
                  <span className="ml-auto font-medium text-gray-700 money">{fmt(summary.sourceBreakdown[key])}</span>
                </div>
              ))}
            </div>

            {/* Apple legend */}
            {fruitClusters.length > 0 && (
              <div className="border-t border-gray-100 pt-2 space-y-1">
                <p className="text-xs text-gray-400">On your tree:</p>
                <div className="flex flex-wrap gap-3">
                  {[...fruitClusters].reverse().map((cluster) => (
                    <div key={cluster.denomination} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <AppleDot color={cluster.color} />
                      <span className="money">{cluster.count} × ${cluster.denomination}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity — full width below */}
      {transactions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Recent Activity</h2>
            {transactions.length > 5 && (
              <Link
                href={ROUTES.CHILD.ACTIVITY(child.id)}
                className="text-xs font-medium text-sprout-600 hover:text-sprout-800 transition-colors"
              >
                View all →
              </Link>
            )}
          </div>
          <div className="card-surface divide-y divide-gray-100">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700 capitalize">{tx.source}</p>
                  <p className="text-xs text-gray-400">
                    {fmtDate(tx.created_at)}{tx.note ? ` · ${tx.note}` : ''}
                  </p>
                </div>
                <span className={`font-semibold money ${tx.amount >= 0 ? 'text-sprout-600' : 'text-red-500'}`}>
                  {tx.amount >= 0 ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
