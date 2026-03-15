'use client'

import type { TreeStage } from '@/types/domain'

// TODO: Render the correct tree SVG for the current stage
// SVG files: /public/tree/sapling.svg, young-tree.svg, growing-tree.svg, mature-tree.svg
// Tree transitions smoothly when stage advances (CSS scale/opacity transition)
export default function TreeStageComponent({ stage }: { stage: TreeStage }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/tree/${stage === 'sapling' ? 'sapling' : stage === 'young' ? 'young-tree' : stage === 'growing' ? 'growing-tree' : 'mature-tree'}.svg`}
      alt={`${stage} tree`}
      className="w-full h-full object-contain"
    />
  )
}
