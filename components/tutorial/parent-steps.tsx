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

  // ── 2. Parent Dashboard ───────────────────────────────────────────────────
  {
    id:    'dashboard',
    title: 'Your Parent Dashboard',
    body:  "This is your home base. All your children appear here. Tap any child card to open their savings account and take action.",
    mockup: (
      <div className="space-y-2">
        {[
          { initial: 'E', name: 'Emma', amount: '$47.25', color: 'bg-sprout-100 text-sprout-700' },
          { initial: 'L', name: 'Liam', amount: '$12.50', color: 'bg-blue-100 text-blue-700'    },
        ].map(({ initial, name, amount, color }) => (
          <div key={name} className="flex items-center gap-3 rounded-2xl border border-sprout-100 bg-white p-3 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${color}`}>
              {initial}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-xs text-gray-400">{amount} saved</p>
            </div>
            <span className="text-gray-300 text-lg">›</span>
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sprout-300 py-3">
          <span className="text-sm font-semibold text-sprout-600">＋ Add Child</span>
        </div>
      </div>
    ),
  },

  // ── 3. Action Buttons ─────────────────────────────────────────────────────
  {
    id:    'transactions',
    title: 'Adding Money & Recording Spending',
    body:  "Inside each child's profile you'll find action buttons. Use them to add money (allowance, gifts, jobs) or record what they spend.",
    mockup: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 divide-x divide-sprout-100 overflow-hidden rounded-2xl border border-sprout-100 bg-white shadow-sm">
          <div className="p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Savings</p>
            <p className="text-xl font-bold text-sprout-700">$47.25</p>
          </div>
          <div className="p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Free to Use</p>
            <p className="text-xl font-bold text-gray-700">$22.25</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-sprout-300 bg-sprout-50/60 p-3">
          {[
            { label: '+ Add Money',      primary: true  },
            { label: 'Record Spending',  primary: false },
            { label: 'New Goal',         primary: false },
            { label: 'Allocate to Goal', primary: false },
          ].map(({ label, primary }) => (
            <div
              key={label}
              className={`rounded-xl px-3 py-2 text-sm font-bold ${
                primary ? 'bg-sprout-500 text-white' : 'border-2 border-gray-200 bg-white text-gray-600'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 4. Goals ──────────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Savings Goals',
    body:  "Create goals for things your child is saving toward. Use '+ Add' to move money into a goal and '− Take back' to return it to their free balance.",
    mockup: (
      <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-800">New Bike 🚲</p>
            <p className="text-xs text-gray-400 mt-0.5">Goal: $120.00</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-sprout-700">$25.00</p>
            <p className="text-xs text-gray-400">saved</p>
          </div>
        </div>
        <div>
          <div className="h-2.5 overflow-hidden rounded-full bg-sprout-100">
            <div className="h-full rounded-full bg-sprout-500" style={{ width: '21%' }} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>21% funded</span>
            <span>$95.00 to go</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-sprout-500 py-2.5 text-center text-sm font-bold text-white">
            + Add
          </div>
          <div className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-center text-sm font-bold text-gray-500">
            − Take back
          </div>
        </div>
      </div>
    ),
  },

  // ── 5. Earnings Breakdown ─────────────────────────────────────────────────
  {
    id:    'earnings',
    title: 'Activity & Earnings Breakdown',
    body:  "The earnings chart shows exactly where your child's money came from — allowances, gifts, jobs, and interest. Every transaction is logged in the Activity table below.",
    mockup: (
      <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Earnings Breakdown</p>
        <div className="flex items-center gap-5">
          <svg viewBox="0 0 100 100" className="-rotate-90 h-24 w-24 shrink-0">
            {/* Allowance 55% */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#4ade80" strokeWidth="18"
              strokeDasharray="124.4 101.8" strokeDashoffset="0" />
            {/* Gift 22% */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#c084fc" strokeWidth="18"
              strokeDasharray="49.8 176.4" strokeDashoffset="-124.4" />
            {/* Jobs 15% */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#60a5fa" strokeWidth="18"
              strokeDasharray="33.9 192.3" strokeDashoffset="-174.2" />
            {/* Interest 8% */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#2dd4bf" strokeWidth="18"
              strokeDasharray="18.1 208.1" strokeDashoffset="-208.1" />
          </svg>
          <div className="flex-1 space-y-1.5">
            {[
              { label: 'Allowance', hex: '#4ade80', amount: '$33.00', pct: '55%' },
              { label: 'Gift',      hex: '#c084fc', amount: '$13.20', pct: '22%' },
              { label: 'Jobs',      hex: '#60a5fa', amount: '$9.00',  pct: '15%' },
              { label: 'Interest',  hex: '#2dd4bf', amount: '$4.80',  pct: '8%'  },
            ].map(({ label, hex, amount, pct }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: hex }} />
                <span className="flex-1 text-xs text-gray-600">{label}</span>
                <span className="text-xs font-semibold tabular-nums text-gray-800">{amount}</span>
                <span className="w-7 text-right text-xs text-gray-400">{pct}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-100 pt-1">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-xs font-semibold text-gray-800">$60.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── 6. Settings page ─────────────────────────────────────────────────────
  {
    id:    'settings',
    title: 'Settings ⚙️',
    body:  "Tap the ⚙️ gear icon in the header to open Settings. Enable Quick Access so you can jump between children without going back to the dashboard. Tap Advanced to configure each child's allowance and interest.",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-800">Quick Access</p>
              <p className="text-xs text-gray-400 mt-0.5">Switch profiles directly from the header</p>
            </div>
            <div className="flex h-6 w-11 shrink-0 items-center justify-end rounded-full bg-sprout-500 px-0.5">
              <div className="h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm">
          <div>
            <p className="font-semibold text-gray-800">Advanced</p>
            <p className="text-xs text-gray-400 mt-0.5">Per-child allowance &amp; interest rates</p>
          </div>
          <span className="text-xl text-gray-400">›</span>
        </div>
      </div>
    ),
  },

  // ── 7. Allowance & Interest ───────────────────────────────────────────────
  {
    id:    'automation',
    title: 'Allowance & Interest 💵📈',
    body:  "Toggle on a recurring allowance and set an interest rate. CoinSprout deposits money automatically on the day you choose — no reminders needed!",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">Recurring Allowance</p>
            <div className="flex h-6 w-11 shrink-0 items-center justify-end rounded-full bg-sprout-500 px-0.5">
              <div className="h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-gray-200 p-2.5">
              <p className="text-xs text-gray-400">Amount</p>
              <p className="font-bold text-gray-800">$10.00</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-2.5">
              <p className="text-xs text-gray-400">Paid on</p>
              <p className="font-bold text-gray-800">Monday</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">Monthly Interest</p>
            <div className="flex h-6 w-11 shrink-0 items-center justify-end rounded-full bg-sprout-500 px-0.5">
              <div className="h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-2.5">
            <p className="font-bold text-gray-800">2.0%</p>
            <p className="text-xs text-gray-400">per month · auto-deposited</p>
          </div>
        </div>
      </div>
    ),
  },

  // ── 8. Animal Friends & Milestones ────────────────────────────────────────
  {
    id:    'milestones',
    title: 'Animal Friends & Milestones',
    body:  "As lifetime earnings hit milestones, your child unlocks animal friends who live in the tree permanently — even if they spend money. A great way to celebrate long-term progress!",
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

  // ── 9. All set ────────────────────────────────────────────────────────────
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
