import { z } from 'zod'

const threshold = z.number().positive().max(99999)

export const childSettingsSchema = z.object({
  childId: z.string().uuid(),

  // Tree thresholds — must be strictly ascending
  treeYoung:   threshold,
  treeGrowing: threshold,
  treeMature:  threshold,
  treeAncient: threshold,

  // Animal thresholds — must be strictly ascending
  milestoneBunny: threshold,
  milestoneBird:  threshold,
  milestoneDeer:  threshold,
  milestoneOwl:   threshold,
  milestoneFox:   threshold,

  // Fruit base value
  fruitBaseValue: z.number().positive().max(9999),
}).superRefine((data, ctx) => {
  // Tree ascending order
  const tree = [
    { val: data.treeYoung,   label: 'Young tree',   path: 'treeYoung'   },
    { val: data.treeGrowing, label: 'Growing tree',  path: 'treeGrowing' },
    { val: data.treeMature,  label: 'Mature tree',   path: 'treeMature'  },
    { val: data.treeAncient, label: 'Ancient tree',  path: 'treeAncient' },
  ]
  for (let i = 1; i < tree.length; i++) {
    if (tree[i].val <= tree[i - 1].val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${tree[i].label} threshold must be greater than ${tree[i - 1].label}`,
        path: [tree[i].path],
      })
    }
  }

  // Animal ascending order
  const animals = [
    { val: data.milestoneBunny, label: 'Bunny', path: 'milestoneBunny' },
    { val: data.milestoneBird,  label: 'Bird',  path: 'milestoneBird'  },
    { val: data.milestoneDeer,  label: 'Deer',  path: 'milestoneDeer'  },
    { val: data.milestoneOwl,   label: 'Owl',   path: 'milestoneOwl'   },
    { val: data.milestoneFox,   label: 'Fox',   path: 'milestoneFox'   },
  ]
  for (let i = 1; i < animals.length; i++) {
    if (animals[i].val <= animals[i - 1].val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${animals[i].label} threshold must be greater than ${animals[i - 1].label}`,
        path: [animals[i].path],
      })
    }
  }
})

export type ChildSettingsInput = z.infer<typeof childSettingsSchema>
