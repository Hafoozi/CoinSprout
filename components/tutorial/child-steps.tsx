import type { TutorialStep } from './tutorial-overlay'

export const childSteps: TutorialStep[] = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id:    'welcome',
    title: 'Welcome to Your Tree! 🌳',
    body:  "This is YOUR special place! Here you can see your money growing, your animal friends, and the things you're saving up for. Let's look around!",
    mockup: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="text-6xl leading-none drop-shadow-sm">🌳</div>
        <div className="flex gap-1 text-2xl">🐰🐦🦌</div>
        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold text-sprout-700">Your tree is waiting to grow!</p>
          <p className="text-xs text-gray-400">Save money, unlock friends</p>
        </div>
      </div>
    ),
  },

  // ── 2. Savings ────────────────────────────────────────────────────────────
  {
    id:    'savings',
    title: 'Your Savings 💰',
    body:  "This shows how much money you have saved up! Every time you get allowance or a special gift, your savings get bigger and bigger.",
    mockup: (
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-sprout-100 space-y-1.5">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">My Savings 💰</p>
        <p className="text-4xl font-bold text-sprout-700 money">$47.50</p>
        <div className="flex justify-center gap-4 pt-1">
          <div className="text-center">
            <p className="text-xs text-gray-400">Free to use</p>
            <p className="text-sm font-bold text-gray-600 money">$17.50</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-xs text-gray-400">Lifetime earned</p>
            <p className="text-sm font-bold text-gray-600 money">$85.00</p>
          </div>
        </div>
      </div>
    ),
  },

  // ── 3. Tree ───────────────────────────────────────────────────────────────
  {
    id:    'tree',
    title: 'Your Growing Tree 🌱',
    body:  "Your tree grows the more you earn over your whole life! The fruit on the tree shows how much you have saved right now. More savings = more fruit!",
    mockup: (
      <div className="flex flex-col items-center gap-3">
        <div className="text-7xl leading-none drop-shadow-sm">🌳</div>
        <div className="flex gap-3">
          {[
            { color: 'bg-sprout-400', label: 'Allowance' },
            { color: 'bg-red-400',    label: 'Gift'      },
            { color: 'bg-yellow-400', label: 'Interest'  },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <span className={`inline-block h-3 w-3 rounded-full ${color} shadow-sm`} />
              {label}
            </span>
          ))}
        </div>
        <div className="rounded-xl bg-sprout-500 px-4 py-1.5 text-center">
          <p className="text-white text-xs font-bold">Save more → more fruit! 🍎</p>
        </div>
      </div>
    ),
  },

  // ── 4. Animal Friends ─────────────────────────────────────────────────────
  {
    id:    'animals',
    title: 'Animal Friends 🐰',
    body:  "When you earn enough money over time, you get to meet animal friends who live in your tree FOREVER! Even if you spend some money, your friends never leave!",
    mockup: (
      <div className="space-y-3">
        <p className="text-xs text-center font-medium text-gray-400">Friends you can earn:</p>
        <div className="flex justify-around">
          {[
            { emoji: '🐰', label: 'Bunny!',   earned: true  },
            { emoji: '🐦', label: 'Bird!',    earned: true  },
            { emoji: '🦌', label: 'Coming!',  earned: false },
          ].map(({ emoji, label, earned }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className={`h-13 w-13 h-12 w-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${earned ? 'bg-sprout-100' : 'bg-gray-100 opacity-40'}`}>
                {emoji}
              </div>
              <p className={`text-xs font-bold ${earned ? 'text-sprout-600' : 'text-gray-400'}`}>
                {label}
              </p>
              {earned && <span className="text-xs text-sprout-400 font-semibold">✓ Yours!</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400 italic">They stay forever, even if you spend 🎉</p>
      </div>
    ),
  },

  // ── 5. Goals ──────────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Your Goals 🎯',
    body:  "What are you saving up for? Goals help you see exactly how close you are to getting something special. Keep saving and you'll get there!",
    mockup: (
      <div className="space-y-2">
        {[
          { emoji: '🚲', name: 'New Bike',   saved: 45, target: 300, pct: 15 },
          { emoji: '🎮', name: 'Video Game', saved: 30, target: 60,  pct: 50 },
        ].map(({ emoji, name, saved, target, pct }) => (
          <div key={name} className="rounded-xl bg-white px-3 py-3 shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">{emoji} {name}</span>
              <span className="text-xs text-gray-400 money">${saved} / ${target}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs font-medium text-sprout-600">{pct}% of the way there! 🙌</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── 6. Completion ─────────────────────────────────────────────────────────
  {
    id:    'complete',
    title: "You're Ready! 🎉",
    body:  "Now you know how your tree works! Keep saving and watch it grow bigger and bigger. The more you save, the more friends you'll meet. You've got this!",
    mockup: (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="text-6xl leading-none drop-shadow-sm">🌳</div>
        <div className="flex gap-1 text-2xl">🐰🐦🦌🦉🦊🐿️</div>
        <div className="rounded-full bg-sprout-500 px-5 py-1.5 shadow-sm">
          <p className="text-white text-xs font-bold">You can do it! 🌱</p>
        </div>
      </div>
    ),
  },
]
