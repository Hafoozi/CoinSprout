import { z } from 'zod'

const threshold  = z.number({ invalid_type_error: 'Must be a number' }).min(0.01, 'Value must be greater than 0').max(99999)
const fruitValue = z.number({ invalid_type_error: 'Must be a number' }).min(0.01, 'Apple value must be greater than 0').max(9999)

export const childSettingsSchema = z.object({
  childId: z.string().uuid(),

  // Tree thresholds — must be strictly ascending
  treeYoung:   threshold,
  treeGrowing: threshold,
  treeMature:  threshold,
  treeAncient: threshold,

  // Animal thresholds — must be strictly ascending
  milestoneBunny:    threshold,
  milestoneBird:     threshold,
  milestoneDeer:     threshold,
  milestoneOwl:      threshold,
  milestoneFox:      threshold,
  milestoneSquirrel: threshold,

  // Individual apple color values
  fruitGreenValue:     fruitValue,
  fruitRedValue:       fruitValue,
  fruitSilverValue:    fruitValue,
  fruitGoldValue:      fruitValue,
  fruitSparklingValue: fruitValue,
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

  // Apple ascending order — report a single generic error on the first out-of-order field
  const apples = [
    { val: data.fruitGreenValue,     path: 'fruitGreenValue'     },
    { val: data.fruitRedValue,       path: 'fruitRedValue'       },
    { val: data.fruitSilverValue,    path: 'fruitSilverValue'    },
    { val: data.fruitGoldValue,      path: 'fruitGoldValue'      },
    { val: data.fruitSparklingValue, path: 'fruitSparklingValue' },
  ]
  for (let i = 1; i < apples.length; i++) {
    if (apples[i].val <= apples[i - 1].val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Apple values must be in order from smallest to largest (green → sparkling)',
        path: [apples[i].path],
      })
      break  // one message is enough
    }
  }

  // Animal ascending order
  const animals = [
    { val: data.milestoneBunny,    label: 'Bunny',    path: 'milestoneBunny'    },
    { val: data.milestoneBird,     label: 'Bird',     path: 'milestoneBird'     },
    { val: data.milestoneDeer,     label: 'Deer',     path: 'milestoneDeer'     },
    { val: data.milestoneOwl,      label: 'Owl',      path: 'milestoneOwl'      },
    { val: data.milestoneFox,      label: 'Fox',      path: 'milestoneFox'      },
    { val: data.milestoneSquirrel, label: 'Squirrel', path: 'milestoneSquirrel' },
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
