'use client'

import type { MilestoneType } from '@/types/domain'

// TODO: Implement milestone animals
// Renders unlocked animal SVGs positioned around the base of the tree
// New unlocks: pop-in CSS animation with a brief celebration effect
// Uses MILESTONES from constants/milestone-thresholds.ts for icon paths
interface Props {
  unlockedMilestones: MilestoneType[]
  newlyUnlocked?: MilestoneType | null
}

export default function MilestoneAnimals({ unlockedMilestones, newlyUnlocked }: Props) {
  return null
}
