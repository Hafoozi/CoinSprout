import { createClient } from '@/lib/supabase/server'
import type { ChildSettings } from '@/lib/db/types'

export async function upsertChildSettings(data: {
  childId: string
  treeYoung:   number | null
  treeGrowing: number | null
  treeMature:  number | null
  treeAncient: number | null
  milestoneBunny: number | null
  milestoneBird:  number | null
  milestoneDeer:  number | null
  milestoneOwl:   number | null
  milestoneFox:   number | null
  fruitGreenValue:     number | null
  fruitRedValue:       number | null
  fruitSilverValue:    number | null
  fruitGoldValue:      number | null
  fruitSparklingValue: number | null
}): Promise<ChildSettings | null> {
  const supabase = await createClient()
  const { data: result } = await supabase
    .from('child_settings')
    .upsert(
      {
        child_id:              data.childId,
        tree_young:            data.treeYoung,
        tree_growing:          data.treeGrowing,
        tree_mature:           data.treeMature,
        tree_ancient:          data.treeAncient,
        milestone_bunny:       data.milestoneBunny,
        milestone_bird:        data.milestoneBird,
        milestone_deer:        data.milestoneDeer,
        milestone_owl:         data.milestoneOwl,
        milestone_fox:         data.milestoneFox,
        fruit_green_value:     data.fruitGreenValue,
        fruit_red_value:       data.fruitRedValue,
        fruit_silver_value:    data.fruitSilverValue,
        fruit_gold_value:      data.fruitGoldValue,
        fruit_sparkling_value: data.fruitSparklingValue,
      },
      { onConflict: 'child_id' }
    )
    .select()
    .single()
  return result ?? null
}
