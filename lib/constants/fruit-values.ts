import type { FruitColor } from '@/types/domain'
import type { IncomeSource } from './sources'

/**
 * Each fruit icon on the tree represents this many dollars.
 * A child with $23 in allowance savings would show 4 green apples (4 × $5 = $20).
 * The remaining $3 rounds down — partial fruit are not shown.
 */
export const FRUIT_UNIT_VALUE = 5

/** Maps each income source to its fruit color. */
export const SOURCE_FRUIT_COLOR: Record<IncomeSource, FruitColor> = {
  allowance: 'green',
  gift:      'red',
  interest:  'gold',
  jobs:      'green',
}

/** Maps fruit color to the SVG asset path. */
export const FRUIT_ICON_PATH: Record<FruitColor, string> = {
  green: '/fruit/apple-green.svg',
  red:   '/fruit/apple-red.svg',
  gold:  '/fruit/apple-gold.svg',
}

/** Maximum fruit displayed per source before grouping is capped visually. */
export const MAX_FRUIT_PER_SOURCE = 10
