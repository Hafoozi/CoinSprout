import { type CSSProperties, type ReactNode } from 'react'
import type { TutorialStep } from './tutorial-overlay'

// ── Screenshot helpers ────────────────────────────────────────────────────────

function Shot({ src, children }: { src: string; children?: ReactNode }) {
  return (
    <div className="-m-4 relative overflow-hidden select-none">
      <img src={src} className="w-full block" alt="" draggable={false} />
      {children}
    </div>
  )
}

function Highlight({ style }: { style: CSSProperties }) {
  return (
    <div
      className="absolute border-2 border-yellow-400 rounded bg-yellow-400/20 pointer-events-none z-10"
      style={style}
    />
  )
}

function Callout({ text, style }: { text: string; style: CSSProperties }) {
  return (
    <div
      className="absolute bg-sprout-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg leading-tight pointer-events-none z-10 whitespace-nowrap"
      style={style}
    >
      {text}
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

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
    body:  "This is your home base. All your children appear here. Click any child card to open their savings account and take action.",
    mockup: (
      <Shot src="/tutorial/parent-dashboard.png">
        <Highlight style={{ top: '9%', left: '65%', width: '13%', height: '9%' }} />
        <Callout text="Add each child here" style={{ top: '19%', left: '58%' }} />
        <Highlight style={{ top: '23%', left: '22%', width: '56%', height: '14%' }} />
        <Callout text="Click to manage" style={{ top: '38%', left: '35%' }} />
      </Shot>
    ),
  },

  // ── 3. Action Buttons ─────────────────────────────────────────────────────
  {
    id:    'transactions',
    title: 'Adding Money & Recording Spending',
    body:  "Inside each child's profile you'll find four action buttons. Use them to add money (allowance, gifts, jobs) or record what they spend.",
    mockup: (
      <Shot src="/tutorial/child-detail.png">
        <Highlight style={{ top: '36%', left: '2%', width: '96%', height: '10%' }} />
        <Callout text="↑ Your four action buttons" style={{ top: '47%', left: '22%' }} />
      </Shot>
    ),
  },

  // ── 4. Goals ──────────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Savings Goals',
    body:  "Create goals for things your child is saving toward. Use '+ Add' to move money into a goal and '- Take back' to return it to their free balance.",
    mockup: (
      <Shot src="/tutorial/child-detail.png">
        <Highlight style={{ top: '47%', left: '2%', width: '96%', height: '40%' }} />
        <Callout text="↑ Goals — allocate & take back" style={{ top: '88%', left: '18%' }} />
      </Shot>
    ),
  },

  // ── 5. Earnings Breakdown ─────────────────────────────────────────────────
  {
    id:    'earnings',
    title: 'Activity & Earnings Breakdown',
    body:  "The earnings chart shows exactly where your child's money came from — allowances, gifts, jobs, and interest. Every transaction is logged in the Activity table below.",
    mockup: (
      <Shot src="/tutorial/child-activity.png">
        <Highlight style={{ top: '18%', left: '2%', width: '96%', height: '40%' }} />
        <Callout text="↑ Where every dollar came from" style={{ top: '59%', left: '16%' }} />
      </Shot>
    ),
  },

  // ── 6. Settings page ─────────────────────────────────────────────────────
  {
    id:    'settings',
    title: 'Settings ⚙️',
    body:  "Tap the ⚙️ gear icon in the header to open Settings. Enable Quick Access so you can jump between children without going back to the dashboard. Scroll down to Advanced to configure each child's allowance and interest.",
    mockup: (
      <Shot src="/tutorial/parent-settings.png">
        <Highlight style={{ top: '34%', left: '28%', width: '44%', height: '17%' }} />
        <Callout text="Quick profile switching" style={{ top: '52%', left: '28%' }} />
        <Highlight style={{ top: '92%', left: '28%', width: '44%', height: '8%' }} />
        <Callout text="Per-child setup ↑" style={{ top: '85%', left: '47%' }} />
      </Shot>
    ),
  },

  // ── 7. Allowance & Interest ───────────────────────────────────────────────
  {
    id:    'automation',
    title: 'Allowance & Interest 💵📈',
    body:  "Toggle on a recurring allowance and set an interest rate. CoinSprout deposits money automatically on the day you choose — no reminders needed!",
    mockup: (
      <Shot src="/tutorial/child-advanced.png">
        <Highlight style={{ top: '7%', left: '2%', width: '95%', height: '36%' }} />
        <Callout text="Toggle on & set day + amount" style={{ top: '37%', left: '4%' }} />
        <Highlight style={{ top: '43%', left: '2%', width: '95%', height: '34%' }} />
        <Callout text="Add a monthly interest rate" style={{ top: '78%', left: '4%' }} />
      </Shot>
    ),
  },

  // ── 7. Animal Friends ─────────────────────────────────────────────────────
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

  // ── 8. All set ────────────────────────────────────────────────────────────
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
