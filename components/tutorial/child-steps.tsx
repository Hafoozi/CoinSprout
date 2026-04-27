import type { TutorialStep } from './tutorial-overlay'

export const childSteps: TutorialStep[] = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id:    'welcome',
    title: 'Welcome to Your Tree! 🌳',
    body:  "This is YOUR special place! Here you can see your money growing, your animal friends, and the things you're saving up for. Let's look around!",
  },

  // ── 2. Savings ────────────────────────────────────────────────────────────
  {
    id:    'savings',
    title: 'Your Savings 💰',
    body:  "This shows how much money you have saved up! Every time you get allowance or a special gift, your savings get bigger and bigger.",
    mockup: (
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm space-y-1">
        <p className="text-xs text-gray-500 font-medium">My Savings 💰</p>
        <p className="text-3xl font-bold text-sprout-700 money">$47.50</p>
        <p className="text-xs text-gray-400 money">Lifetime earned: $85.00</p>
      </div>
    ),
  },

  // ── 3. Tree ───────────────────────────────────────────────────────────────
  {
    id:    'tree',
    title: 'Your Growing Tree 🌱',
    body:  "Your tree grows the more you earn over your whole life! The fruit on the tree shows how much you have saved right now. More savings = more fruit on your tree!",
    mockup: (
      <div className="flex flex-col items-center gap-3">
        <div className="relative text-6xl leading-none select-none">🌳</div>
        <div className="flex gap-3">
          {[
            { color: 'bg-sprout-400', label: 'Allowance' },
            { color: 'bg-red-400',    label: 'Gift'      },
            { color: 'bg-yellow-400', label: 'Interest'  },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
        <p className="text-xs text-sprout-600 font-medium text-center">
          Save more → get more fruit → grow your tree!
        </p>
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
        <p className="text-xs text-center text-gray-400">Friends you can earn:</p>
        <div className="flex justify-around">
          {[
            { emoji: '🐰', label: 'Bunny!',  earned: true  },
            { emoji: '🐦', label: 'Bird!',   earned: true  },
            { emoji: '🦌', label: 'Coming!', earned: false },
          ].map(({ emoji, label, earned }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${earned ? 'bg-sprout-100' : 'bg-gray-100 opacity-40'}`}>
                {emoji}
              </div>
              <p className={`text-xs font-bold ${earned ? 'text-sprout-600' : 'text-gray-400'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
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
          <div key={name} className="rounded-xl bg-white p-3 shadow-sm space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800">{emoji} {name}</span>
              <span className="text-gray-400 money">${saved} / ${target}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400">{pct}% of the way there!</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── 6. Completion ─────────────────────────────────────────────────────────
  {
    id:    'complete',
    title: "You're Ready! 🎉",
    body:  "Now you know how your tree works! Keep saving and watch it grow bigger and bigger. The more you save, the more friends you'll meet. Happy saving!",
    mockup: (
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="text-5xl">🌳</div>
        <div className="flex gap-1 text-2xl">🐰🐦🦌🦉🦊🐿️</div>
        <p className="text-xs text-sprout-600 font-semibold">You can do it!</p>
      </div>
    ),
  },
]
