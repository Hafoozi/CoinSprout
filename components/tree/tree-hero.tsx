'use client'

import type { TreeStage, FruitCluster, MilestoneType } from '@/types/domain'

// TODO: Implement tree hero panel — the visual centerpiece of the child screen
// Renders: TreeStage SVG, FruitCluster overlays, MilestoneAnimals
// Fruit and animals use CSS animations (fade-in, pop-in) on mount
// Tree SVG chosen based on lifetime earnings stage
interface Props {
  stage: TreeStage
  fruitClusters: FruitCluster[]
  unlockedMilestones: MilestoneType[]
}

export default function TreeHero({ stage, fruitClusters, unlockedMilestones }: Props) {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto bg-sprout-50 rounded-3xl flex items-center justify-center">
      <p className="text-sm text-gray-400">Tree — {stage}</p>
    </div>
  )
}
