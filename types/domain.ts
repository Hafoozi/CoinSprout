/**
 * Domain-level types: derived or composed types used in application logic.
 * These are not raw database rows — they represent how the app thinks about data.
 */

import type { MilestoneType } from './database'

// ─── Tree ──────────────────────────────────────────────────────────────────

/** The five visual stages of the tree, driven by lifetime earnings. */
export type TreeStage = 'sapling' | 'young' | 'growing' | 'mature' | 'ancient'

// ─── Fruit ─────────────────────────────────────────────────────────────────

export type FruitColor = 'green' | 'red' | 'silver' | 'gold' | 'sparkling'

/** One cluster of fruit displayed on the tree. */
export interface FruitCluster {
  color:        FruitColor
  denomination: number   // dollar value each fruit represents (5, 10, 20, 250, or 1000)
  count:        number   // number of fruit icons to render
}

// ─── Financials ────────────────────────────────────────────────────────────

/** Computed financial summary for a child. */
export interface ChildFinancialSummary {
  savingsBalance:   number   // current balance (earnings minus spending)
  lifetimeEarnings: number   // total ever earned (never decreases)
  totalSpent:       number   // total ever spent (positive number)
  allocatedToGoals: number   // locked toward goals
  freeToUse:        number   // savingsBalance minus allocatedToGoals
  sourceBreakdown:  SourceBreakdown
}

export interface SourceBreakdown {
  allowance: number
  gift:      number
  interest:  number
  jobs:      number
}

// ─── Goals ─────────────────────────────────────────────────────────────────

/** A goal with its computed progress percentage. */
export interface GoalWithProgress {
  id: string
  name: string
  targetPrice: number
  allocatedAmount: number
  progressPercent: number  // 0–100
  isComplete: boolean
}

// ─── Milestones ────────────────────────────────────────────────────────────

export interface MilestoneDefinition {
  type: MilestoneType
  threshold: number   // lifetime earnings required to unlock
  label: string
  iconPath: string    // path to SVG in /public/icons/
}

// ─── Child visual settings (resolved — nulls replaced with defaults) ───────

export interface ResolvedChildSettings {
  treeThresholds: {
    young:   number
    growing: number
    mature:  number
    ancient: number
  }
  milestoneThresholds: {
    bunny: number
    bird:  number
    deer:  number
    owl:   number
    fox:   number
  }
  fruitBaseValue: number
}

// ─── Profile ───────────────────────────────────────────────────────────────

/** App-level session mode. */
export type AppMode = 'parent' | 'child'

export interface ActiveChildProfile {
  childId: string
  childName: string
  avatarColor: string
}
