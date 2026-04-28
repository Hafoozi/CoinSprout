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
    body:  "Your tree grows the more you earn! Fruit on the tree shows how much you have saved right now. On the right you can see your total savings and how much is free to spend.",
    mockup: (
      <Shot src="/tutorial/child-tree.png">
        <Highlight style={{ top: '1%', left: '1%', width: '44%', height: '57%' }} />
        <Callout text="Your growing tree!" style={{ top: '59%', left: '2%' }} />
        <Highlight style={{ top: '1%', left: '47%', width: '51%', height: '22%' }} />
        <Callout text="Your savings" style={{ top: '24%', left: '54%' }} />
      </Shot>
    ),
  },

  // ── 3. Animal Friends ─────────────────────────────────────────────────────
  {
    id:    'animals',
    title: 'Animal Friends 🐰',
    body:  "When you earn enough money over time, you get to meet animal friends who live in your tree FOREVER! Even if you spend some money, your friends never leave!",
    mockup: (
      <Shot src="/tutorial/child-tree.png">
        <Highlight style={{ top: '57%', left: '1%', width: '44%', height: '13%' }} />
        <Callout text="↑ Friends you've unlocked!" style={{ top: '71%', left: '2%' }} />
      </Shot>
    ),
  },

  // ── 4. Your Goals ─────────────────────────────────────────────────────────
  {
    id:    'goals',
    title: 'Your Goals 🎯',
    body:  "What are you saving up for? Goals help you see exactly how close you are to getting something special. Keep saving and you'll get there!",
    mockup: (
      <Shot src="/tutorial/child-tree.png">
        <Highlight style={{ top: '22%', left: '47%', width: '51%', height: '35%' }} />
        <Callout text="Things you're saving up for" style={{ top: '58%', left: '48%' }} />
      </Shot>
    ),
  },

  // ── 5. Explore ────────────────────────────────────────────────────────────
  {
    id:    'navigation',
    title: 'Explore Your Pages 📋',
    body:  "Use the tabs at the bottom to switch between Tree, Goals, and Activity. Your Activity page shows every time money comes in or goes out!",
    mockup: (
      <Shot src="/tutorial/child-tree.png">
        <Highlight style={{ top: '91%', left: '0%', width: '100%', height: '9%' }} />
        <Callout text="Switch pages here" style={{ top: '84%', left: '34%' }} />
      </Shot>
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
