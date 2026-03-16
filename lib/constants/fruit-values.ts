import type { FruitColor } from '@/types/domain'

/** Fruit denominations from highest to lowest, used for greedy calculation. */
export const FRUIT_DENOMINATIONS: Array<{ value: number; color: FruitColor }> = [
  { value: 20, color: 'gold'  },
  { value: 10, color: 'red'   },
  { value: 5,  color: 'green' },
]

/** Maximum fruit icons displayed per denomination before visual cap. */
export const MAX_FRUIT_PER_DENOM = 20
