import type { ChildSettings } from '@/lib/db/types'
import type { ResolvedChildSettings } from '@/types/domain'

export const DEFAULT_SETTINGS: ResolvedChildSettings = {
  treeThresholds: {
    young:   50,
    growing: 200,
    mature:  500,
    ancient: 1000,
  },
  milestoneThresholds: {
    bunny:    25,
    bird:     75,
    deer:     200,
    owl:      500,
    fox:      1000,
    squirrel: 2000,
  },
  fruitValues: {
    green:     5,
    red:       10,
    silver:    20,
    gold:      250,
    sparkling: 1000,
  },
}

/**
 * Merge a DB child_settings row with app defaults.
 * Any null column falls back to the default value.
 */
export function resolveChildSettings(row: ChildSettings | null): ResolvedChildSettings {
  if (!row) return DEFAULT_SETTINGS
  return {
    treeThresholds: {
      young:   row.tree_young   ?? DEFAULT_SETTINGS.treeThresholds.young,
      growing: row.tree_growing ?? DEFAULT_SETTINGS.treeThresholds.growing,
      mature:  row.tree_mature  ?? DEFAULT_SETTINGS.treeThresholds.mature,
      ancient: row.tree_ancient ?? DEFAULT_SETTINGS.treeThresholds.ancient,
    },
    milestoneThresholds: {
      bunny:    row.milestone_bunny ?? DEFAULT_SETTINGS.milestoneThresholds.bunny,
      bird:     row.milestone_bird  ?? DEFAULT_SETTINGS.milestoneThresholds.bird,
      deer:     row.milestone_deer  ?? DEFAULT_SETTINGS.milestoneThresholds.deer,
      owl:      row.milestone_owl   ?? DEFAULT_SETTINGS.milestoneThresholds.owl,
      fox:      row.milestone_fox   ?? DEFAULT_SETTINGS.milestoneThresholds.fox,
      squirrel: row.milestone_squirrel ?? DEFAULT_SETTINGS.milestoneThresholds.squirrel,
    },
    fruitValues: {
      green:     row.fruit_green_value     ?? DEFAULT_SETTINGS.fruitValues.green,
      red:       row.fruit_red_value       ?? DEFAULT_SETTINGS.fruitValues.red,
      silver:    row.fruit_silver_value    ?? DEFAULT_SETTINGS.fruitValues.silver,
      gold:      row.fruit_gold_value      ?? DEFAULT_SETTINGS.fruitValues.gold,
      sparkling: row.fruit_sparkling_value ?? DEFAULT_SETTINGS.fruitValues.sparkling,
    },
  }
}
