import type { TutorialStep } from './tutorial-overlay'

export const parentSteps: TutorialStep[] = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id:    'welcome',
    title: 'Welcome to CoinSprout! 🌱',
    body:  "CoinSprout helps your children build healthy saving habits. You manage the money — they watch their world grow. Let's take a quick tour.",
  },

  // ── 2. Dashboard ──────────────────────────────────────────────────────────
  {
    id:    'dashboard',
    title: 'Your Parent Dashboard',
    body:  "Here you'll see all your children at a glance — their current savings, active goals, and next allowance date. Everything in one place.",
    mockup: (
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Children (1)</p>
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-sprout-200 flex items-center justify-center text-sm font-bold text-sprout-700">
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Jamie</p>
              <p className="text-xs text-gray-400">2 active goals</p>
            </div>
          </div>
          <p className="text-sm font-bold text-sprout-700 money">$47.50</p>
        </div>
      </div>
    ),
  },

  // ── 3. Add Child ──────────────────────────────────────────────────────────
  {
    id:    'add-child',
    title: 'Adding a Child',
    body:  'Use the "+ Add child" button to create a profile for each of your children. Each child gets their own savings balance, goals, and growing tree.',
    mockup: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500">Your children</p>
          <div className="rounded-xl bg-sprout-500 px-3 py-1.5 text-xs font-bold text-white">
            + Add child
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-sprout-200 py-5 text-center">
          <p className="text-3xl">🌱</p>
          <p className="text-xs text-gray-400 mt-1.5">Add a child to get started</p>
        </div>
      </div>
    ),
  },

  // ── 4. Transactions ───────────────────────────────────────────────────────
  {
    id:    'transactions',
    title: 'Adding Money & Recording Spending',
    body:  "Open a child's profile to add money (allowance, gifts, interest) or record when they spend. Every transaction is tracked and shown on their tree.",
    mockup: (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-sprout-500 px-4 py-2.5">
          <span className="text-base">💵</span>
          <span className="text-white font-semibold text-sm">Add Money</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
          <span className="text-base">🛍️</span>
          <span className="text-gray-700 font-semibold text-sm">Record Spending</span>
        </div>
        <div className="pt-1 border-t border-sprout-100 space-y-1.5">
          {[
            { icon: '💵', label: 'Allowance', amount: '+$5.00',  color: 'text-sprout-600' },
            { icon: '🎁', label: 'Gift',       amount: '+$10.00', color: 'text-sprout-600' },
            { icon: '🛍️', label: 'Toy store',  amount: '-$3.50',  color: 'text-red-500'   },
          ].map(({ icon, label, amount, color }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span>{icon}</span>{label}
              </span>
              <span className={`font-semibold money ${color}`}>{amount}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 5. Goals ──────────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Savings Goals',
    body:  "Create goals for things your child is saving toward. Allocate money from their savings to each goal so they can see exactly how close they are.",
    mockup: (
      <div className="space-y-2">
        {[
          { emoji: '🚲', name: 'New Bike',   saved: 45,  target: 300, pct: 15  },
          { emoji: '🎮', name: 'Video Game', saved: 30,  target: 60,  pct: 50  },
        ].map(({ emoji, name, saved, target, pct }) => (
          <div key={name} className="rounded-xl bg-white p-3 shadow-sm space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-800">{emoji} {name}</span>
              <span className="text-gray-400 money">${saved} / ${target}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400">{pct}% saved</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── 6. Tree & Fruit ───────────────────────────────────────────────────────
  {
    id:    'tree-fruit',
    title: 'The Tree & Fruit',
    body:  "Your child sees a living tree. Fruit on the tree represents their current savings — green for allowance, red for gifts, gold for interest. The tree itself grows as lifetime earnings increase.",
    mockup: (
      <div className="flex flex-col items-center gap-3">
        <div className="text-6xl leading-none">🌳</div>
        <div className="flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-sprout-400 shadow-sm" />
            Allowance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-red-400 shadow-sm" />
            Gift
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
            Interest
          </span>
        </div>
        <div className="w-full rounded-xl bg-white px-3 py-2 text-center shadow-sm">
          <p className="text-xs text-gray-400">Current savings</p>
          <p className="text-lg font-bold text-sprout-700 money">$47.50</p>
        </div>
      </div>
    ),
  },

  // ── 7. Animal Friends ─────────────────────────────────────────────────────
  {
    id:    'milestones',
    title: 'Animal Friends',
    body:  "As your child's lifetime earnings hit milestones, they unlock animal friends who live in the tree permanently — even if money is spent. A great way to celebrate long-term progress.",
    mockup: (
      <div className="space-y-2">
        <p className="text-xs text-center text-gray-400 mb-1">Lifetime earnings milestones</p>
        <div className="flex justify-around">
          {[
            { emoji: '🐰', label: 'Bunny',    amount: '$25',  earned: true  },
            { emoji: '🐦', label: 'Bird',     amount: '$50',  earned: true  },
            { emoji: '🦌', label: 'Deer',     amount: '$100', earned: false },
          ].map(({ emoji, label, amount, earned }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center text-2xl transition-opacity ${earned ? 'bg-sprout-100' : 'bg-gray-100 opacity-40'}`}>
                {emoji}
              </div>
              <p className={`text-xs font-medium money ${earned ? 'text-sprout-700' : 'text-gray-400'}`}>{amount}</p>
              <p className={`text-xs ${earned ? 'text-sprout-500' : 'text-gray-400'}`}>{earned ? '✓' : 'Next'}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 8. Automation ─────────────────────────────────────────────────────────
  {
    id:    'automation',
    title: 'Automatic Allowance & Interest',
    body:  "Set a weekly allowance and an interest rate for each child. CoinSprout adds money on schedule automatically — no reminders needed.",
    mockup: (
      <div className="space-y-2">
        {[
          { icon: '💵', title: 'Weekly Allowance', sub: 'Every Monday',  value: '$5.00' },
          { icon: '📈', title: 'Monthly Interest',  sub: 'On balance',   value: '2%'    },
        ].map(({ icon, title, sub, value }) => (
          <div key={title} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-sprout-700 money">{value}</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── 9. Completion ─────────────────────────────────────────────────────────
  {
    id:    'complete',
    title: "You're all set! 🎉",
    body:  "That's the full tour. Add your first child, set an allowance, and let CoinSprout do the rest. You can replay this tour anytime from Settings.",
    mockup: (
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="text-5xl">🌳</div>
        <p className="text-sm font-semibold text-sprout-700 text-center">Happy saving!</p>
      </div>
    ),
  },
]
