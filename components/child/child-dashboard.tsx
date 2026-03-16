'use client'

import type { Child, Milestone } from '@/lib/db/types'
import type { ChildFinancialSummary, GoalWithProgress } from '@/types/domain'
import type { Transaction } from '@/lib/db/types'
import TreeHero from '@/components/tree/tree-hero'
import TransactionNotifications from '@/components/child/transaction-notifications'
import { calculateTreeStage } from '@/lib/calculations/tree-stage'
import { calculateFruitClusters } from '@/lib/calculations/fruit'
import { getNextMilestone, amountToNextMilestone } from '@/lib/calculations/milestones'
import type { MilestoneType } from '@/types/database'

interface Props {
  child:        Child
  summary:      ChildFinancialSummary
  transactions: Transaction[]
  goals:        GoalWithProgress[]
  milestones:   Milestone[]
}

const AVATAR_BG: Record<string, string> = {
  sprout: 'bg-sprout-200 text-sprout-800',
  sky:    'bg-sky-200    text-sky-800',
  gold:   'bg-yellow-200 text-yellow-800',
  rose:   'bg-pink-200   text-pink-800',
  violet: 'bg-violet-200 text-violet-800',
  orange: 'bg-orange-200 text-orange-800',
}

function fmt(n: number) {
  return '$' + Math.abs(n).toFixed(2)
}

const ANIMAL_EMOJI: Record<MilestoneType, string> = {
  bunny: '🐰', bird: '🐦', deer: '🦌', owl: '🦉', fox: '🦊',
}

export default function ChildDashboard({ child, summary, transactions, goals, milestones }: Props) {
  const stage         = calculateTreeStage(summary.lifetimeEarnings)
  const fruitClusters = calculateFruitClusters(transactions)
  const unlockedTypes = milestones.map((m) => m.milestone_type as MilestoneType)
  const nextMilestone = getNextMilestone(summary.lifetimeEarnings)
  const amountToNext  = amountToNextMilestone(summary.lifetimeEarnings)
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
        <div className="card-surface p-4">
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

          {/* Fruit legend */}
          {fruitClusters.length > 0 && (
            <div className="card-surface p-4 space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">My Fruit</h2>
              <div className="space-y-1.5">
                {fruitClusters.map((cluster) => (
                  <div key={cluster.source} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: cluster.color === 'green' ? '#15803d' : cluster.color === 'red' ? '#b91c1c' : '#b45309' }}
                    />
                    <span className="capitalize text-gray-600">{cluster.source}</span>
                    <span className="ml-auto text-gray-400 money">{cluster.count} × $5</span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 pt-1">Each fruit = $5 saved 🍎</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent activity — full width below */}
      {transactions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 px-1">Recent Activity</h2>
          <div className="card-surface divide-y divide-gray-100">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700 capitalize">{tx.source}</p>
                  {tx.note && <p className="text-xs text-gray-400">{tx.note}</p>}
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
