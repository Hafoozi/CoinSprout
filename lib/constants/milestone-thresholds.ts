import type { MilestoneDefinition } from '@/types/domain'

/**
 * Animal milestone definitions.
 * Animals unlock when a child's lifetime earnings reach the threshold.
 * They never disappear once unlocked.
 */
export const MILESTONES: MilestoneDefinition[] = [
  {
    type:      'bunny',
    threshold: 25,
    label:     'Bunny',
    iconPath:  '/icons/bunny.svg',
  },
  {
    type:      'bird',
    threshold: 75,
    label:     'Bird',
    iconPath:  '/icons/bird.svg',
  },
  {
    type:      'deer',
    threshold: 200,
    label:     'Deer',
    iconPath:  '/icons/deer.svg',
  },
  {
    type:      'owl',
    threshold: 500,
    label:     'Owl',
    iconPath:  '/icons/owl.svg',
  },
  {
    type:      'fox',
    threshold: 1000,
    label:     'Fox',
    iconPath:  '/icons/fox.svg',
  },
  {
    type:      'squirrel',
    threshold: 2000,
    label:     'Squirrel',
    iconPath:  '/icons/squirrel.svg',
  },
]

/** Quick lookup: milestone type → threshold amount. */
export const MILESTONE_THRESHOLD_MAP = Object.fromEntries(
  MILESTONES.map((m) => [m.type, m.threshold])
) as Record<string, number>
