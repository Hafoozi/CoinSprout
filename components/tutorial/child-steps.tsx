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

  // ── 2. Your Tree & Savings ────────────────────────────────────────────────
  {
    id:    'tree-savings',
    title: 'Your Tree & Savings 🌳💰',
    body:  "Your tree grows the more you earn! Fruit on the tree shows how much you have saved right now. Below the tree you can see your total savings and how much is free to spend.",
    mockup: (
      <div className="space-y-3">
        <div className="flex justify-center py-1">
          <div className="relative inline-block leading-none">
            <span className="text-8xl">🌳</span>
            <span className="absolute -top-1 right-3 text-2xl">🍎</span>
            <span className="absolute top-5 left-1 text-xl">🍊</span>
            <span className="absolute bottom-8 right-0 text-lg">🍋</span>
            <span className="absolute bottom-6 left-3 text-base">🍎</span>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-sprout-100 overflow-hidden rounded-2xl border border-sprout-100 bg-white shadow-sm">
          <div className="p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">My Savings</p>
            <p className="text-xl font-bold text-sprout-700">$47.25</p>
          </div>
          <div className="p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Free to Use</p>
            <p className="text-xl font-bold text-gray-700">$22.25</p>
          </div>
        </div>
      </div>
    ),
  },

  // ── 3. Animal Friends ─────────────────────────────────────────────────────
  {
    id:    'animals',
    title: 'Animal Friends 🐰',
    body:  "When you earn enough money over time, you get to meet animal friends who live in your tree FOREVER! Even if you spend some money, your friends never leave!",
    mockup: (
      <div className="space-y-3">
        <p className="text-xs text-center font-medium text-gray-400">Earn money to unlock friends!</p>
        <div className="flex justify-around">
          {[
            { emoji: '🐰', label: 'Bunny',  amount: '$25',  earned: true  },
            { emoji: '🐦', label: 'Bird',   amount: '$50',  earned: true  },
            { emoji: '🦌', label: 'Deer',   amount: '$100', earned: false },
            { emoji: '🦉', label: 'Owl',    amount: '$250', earned: false },
          ].map(({ emoji, label, amount, earned }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-sm ${earned ? 'bg-sprout-100' : 'bg-gray-100 opacity-40'}`}>
                {emoji}
              </div>
              <p className={`text-xs font-bold money ${earned ? 'text-sprout-700' : 'text-gray-400'}`}>{amount}</p>
              <span className={`text-xs font-semibold ${earned ? 'text-sprout-500' : 'text-gray-300'}`}>
                {earned ? '✓ Earned' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 4. Your Goals ─────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Your Goals 🎯',
    body:  "What are you saving up for? Goals help you see exactly how close you are to getting something special. Keep saving and you'll get there!",
    mockup: (
      <div className="rounded-2xl border border-sprout-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-800">New Bike 🚲</p>
            <p className="text-xs text-gray-400 mt-0.5">Goal: $120.00</p>
          </div>
          <div className="shrink-0 text-right">
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

  // ── 5. Explore ────────────────────────────────────────────────────────────
  {
    id:    'navigation',
    title: 'Explore Your Pages 📋',
    body:  "Use the tabs at the bottom to switch between Tree, Goals, and Activity. Your Activity page shows every time money comes in or goes out!",
    mockup: (
      <div className="overflow-hidden rounded-2xl border border-sprout-100 bg-white shadow-sm">
        <div className="flex border-t-2 border-sprout-200">
          {[
            { icon: '🌳', label: 'Tree',     active: true  },
            { icon: '🎯', label: 'Goals',    active: false },
            { icon: '📋', label: 'Activity', active: false },
          ].map(({ icon, label, active }) => (
            <div
              key={label}
              className={`flex flex-1 flex-col items-center gap-0.5 py-4 text-xs font-medium ${
                active ? 'text-sprout-700' : 'text-gray-400'
              }`}
            >
              <span className="text-3xl leading-none">{icon}</span>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
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
