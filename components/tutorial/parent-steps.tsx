import type { TutorialStep } from './tutorial-overlay'

export const parentSteps: TutorialStep[] = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id:    'welcome',
    title: 'Welcome to CoinSprout! 🌱',
    body:  "CoinSprout helps your children build healthy saving habits. You manage the money — they watch their world grow. Let's take a quick tour.",
    mockup: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center text-5xl">
          🌱
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold text-sprout-700">Your family's savings companion</p>
          <p className="text-xs text-gray-400">Set it up once, watch it grow</p>
        </div>
      </div>
    ),
  },

  // ── 2. Dashboard ──────────────────────────────────────────────────────────
  {
    id:    'dashboard',
    title: 'Your Parent Dashboard',
    body:  "Here you'll see all your children at a glance — their current savings, active goals, and next allowance date. Everything in one place.",
    mockup: (
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Children (1)</p>
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-3 shadow-sm border border-sprout-100">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-sprout-200 flex items-center justify-center text-sm font-bold text-sprout-700">
              J
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Jamie</p>
              <p className="text-xs text-gray-400">2 active goals</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-sprout-700 money">$47.50</p>
            <p className="text-xs text-gray-400">saved</p>
          </div>
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
          <div className="rounded-xl bg-sprout-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            + Add child
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-sprout-200 py-6 text-center bg-white/60">
          <p className="text-4xl">🌱</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Add your first child to get started</p>
        </div>
      </div>
    ),
  },

  // ── 4. Transactions ───────────────────────────────────────────────────────
  {
    id:    'transactions',
    title: 'Adding Money & Recording Spending',
    body:  "Open a child's profile to add money (allowance, gifts, interest) or record when they spend. Every transaction appears on their tree.",
    mockup: (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-sprout-500 px-4 py-2.5 shadow-sm">
          <span className="text-lg">💵</span>
          <span className="text-white font-bold text-sm">Add Money</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
          <span className="text-lg">🛍️</span>
          <span className="text-gray-700 font-semibold text-sm">Record Spending</span>
        </div>
        <div className="pt-2 border-t border-sprout-100 space-y-1.5">
          {[
            { icon: '💵', label: 'Allowance',  amount: '+$5.00',  color: 'text-sprout-600' },
            { icon: '🎁', label: 'Gift',        amount: '+$10.00', color: 'text-sprout-600' },
            { icon: '🛍️', label: 'Toy store',  amount: '-$3.50',  color: 'text-red-500'   },
          ].map(({ icon, label, amount, color }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span>{icon}</span>{label}
              </span>
              <span className={`font-bold money ${color}`}>{amount}</span>
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
    body:  "Create goals for things your child is saving toward. Allocate money to each goal so they can see exactly how close they are.",
    mockup: (
      <div className="space-y-2">
        {[
          { emoji: '🚲', name: 'New Bike',   saved: 45,  target: 300, pct: 15 },
          { emoji: '🎮', name: 'Video Game', saved: 30,  target: 60,  pct: 50 },
        ].map(({ emoji, name, saved, target, pct }) => (
          <div key={name} className="rounded-xl bg-white px-3 py-3 shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">{emoji} {name}</span>
              <span className="text-xs text-gray-400 money">${saved} / ${target}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
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
    body:  "Your child sees a living tree. Fruit represents their current savings — green for allowance, red for gifts, gold for interest. The tree grows as lifetime earnings increase.",
    mockup: (
      <div className="flex flex-col items-center gap-3">
        <div className="text-7xl leading-none drop-shadow-sm">🌳</div>
        <div className="flex gap-4">
          {[
            { color: 'bg-sprout-400', label: 'Allowance' },
            { color: 'bg-red-400',    label: 'Gift'      },
            { color: 'bg-yellow-400', label: 'Interest'  },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className={`inline-block h-3 w-3 rounded-full ${color} shadow-sm`} />
              {label}
            </span>
          ))}
        </div>
        <div className="w-full rounded-xl bg-white px-4 py-2.5 text-center shadow-sm border border-sprout-100">
          <p className="text-xs text-gray-400 font-medium">Current savings</p>
          <p className="text-xl font-bold text-sprout-700 money">$47.50</p>
        </div>
      </div>
    ),
  },

  // ── 7. Animal Friends ─────────────────────────────────────────────────────
  {
    id:    'milestones',
    title: 'Animal Friends',
    body:  "As lifetime earnings hit milestones, your child unlocks animal friends who live in the tree permanently — even if money is spent. A great way to celebrate long-term progress.",
    mockup: (
      <div className="space-y-3">
        <p className="text-xs text-center font-medium text-gray-400">Lifetime earnings milestones</p>
        <div className="flex justify-around">
          {[
            { emoji: '🐰', label: 'Bunny',  amount: '$25',  earned: true  },
            { emoji: '🐦', label: 'Bird',   amount: '$50',  earned: true  },
            { emoji: '🦌', label: 'Deer',   amount: '$100', earned: false },
          ].map(({ emoji, label, amount, earned }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${earned ? 'bg-sprout-100' : 'bg-gray-100 opacity-40'}`}>
                {emoji}
              </div>
              <p className={`text-xs font-bold money ${earned ? 'text-sprout-700' : 'text-gray-400'}`}>{amount}</p>
              <span className={`text-xs font-semibold ${earned ? 'text-sprout-500' : 'text-gray-300'}`}>
                {earned ? '✓ Earned' : 'Next up'}
              </span>
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
          { icon: '💵', title: 'Weekly Allowance', sub: 'Every Monday',   value: '$5.00 / wk' },
          { icon: '📈', title: 'Monthly Interest',  sub: 'Applied on balance', value: '2% / mo'    },
        ].map(({ icon, title, sub, value }) => (
          <div key={title} className="flex items-center justify-between rounded-xl bg-white px-3 py-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
            <p className="text-xs font-bold text-sprout-600 money">{value}</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── 9. Completion ─────────────────────────────────────────────────────────
  {
    id:    'complete',
    title: "You're all set! 🎉",
    body:  "That's the full tour! Add your first child, set an allowance, and let CoinSprout do the rest. Tap ? anytime to replay this tour.",
    mockup: (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="text-6xl leading-none drop-shadow-sm">🌳</div>
        <div className="flex gap-1 text-2xl">🐰🐦🦌🦉🦊🐿️</div>
        <div className="rounded-full bg-sprout-500 px-5 py-1.5 shadow-sm">
          <p className="text-white text-xs font-bold">Happy saving! 🌱</p>
        </div>
      </div>
    ),
  },
]
