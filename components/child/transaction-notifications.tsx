'use client'

import { useState, useEffect } from 'react'
import type { Transaction } from '@/lib/db/types'

const SOURCE_CONFIG = {
  allowance: {
    headline: 'Allowance Day!',
    message:  'You showed up and earned it. Keep it up!',
    bg:       'bg-sprout-50',
    border:   'border-sprout-200',
    btn:      'bg-sprout-500 hover:bg-sprout-600',
    icon:     '💵',
  },
  gift: {
    headline: 'You Got a Gift!',
    message:  'Someone special is thinking of you!',
    bg:       'bg-pink-50',
    border:   'border-pink-200',
    btn:      'bg-pink-500 hover:bg-pink-600',
    icon:     '🎁',
  },
  interest: {
    headline: 'Your Money Grew!',
    message:  'Your savings earned interest — money makes money!',
    bg:       'bg-sky-50',
    border:   'border-sky-200',
    btn:      'bg-sky-500 hover:bg-sky-600',
    icon:     '📈',
  },
  jobs: {
    headline: 'Hard Work Pays Off!',
    message:  'You earned this with your effort. Well done!',
    bg:       'bg-amber-50',
    border:   'border-amber-200',
    btn:      'bg-amber-500 hover:bg-amber-600',
    icon:     '⭐',
  },
} as const

// Coins start large near the button and converge upward toward the savings counter
const COINS = [
  { dx: -55, dy: -210, cs: 1.8, delay: 0    },
  { dx: -25, dy: -225, cs: 2.0, delay: 0.04 },
  { dx:   0, dy: -230, cs: 2.0, delay: 0.02 },
  { dx:  25, dy: -225, cs: 1.8, delay: 0.06 },
  { dx:  55, dy: -210, cs: 1.6, delay: 0.08 },
  { dx: -38, dy: -218, cs: 1.7, delay: 0.10 },
  { dx:  38, dy: -218, cs: 1.7, delay: 0.03 },
  { dx:  12, dy: -228, cs: 1.9, delay: 0.07 },
]

const round = (n: number) => Math.round(n * 100) / 100

interface Props {
  childId:      string
  transactions: Transaction[]
}

export default function TransactionNotifications({ childId, transactions }: Props) {
  const [queue,     setQueue]     = useState<Transaction[]>([])
  const [accepting, setAccepting] = useState(false)
  const [showCoins, setShowCoins] = useState(false)
  const [closing,   setClosing]   = useState(false)
  const [countVal,  setCountVal]  = useState(0)

  const savingsBalance = round(transactions.reduce((s, t) => s + t.amount, 0))

  // Initialise from localStorage
  useEffect(() => {
    try {
      const key    = `cs_ack_txns_${childId}`
      const stored = localStorage.getItem(key)
      const income = transactions.filter((t) => t.amount > 0)

      if (stored === null) {
        localStorage.setItem(key, JSON.stringify(income.map((t) => t.id)))
        return
      }

      const acknowledged: string[] = JSON.parse(stored)
      const pending = income.filter((t) => !acknowledged.includes(t.id))
      if (pending.length > 0) {
        setQueue(pending)
        // Counter starts at balance BEFORE all pending transactions
        const pendingTotal = pending.reduce((s, t) => s + t.amount, 0)
        setCountVal(round(savingsBalance - pendingTotal))
      }
    } catch { /* ignore localStorage errors */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId])

  function handleAccept() {
    const tx = queue[0]
    if (!tx || accepting) return

    // Mark acknowledged
    const key = `cs_ack_txns_${childId}`
    try {
      const acknowledged = JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
      localStorage.setItem(key, JSON.stringify([...acknowledged, tx.id]))
    } catch { /* ignore */ }

    const startVal = countVal
    const endVal   = round(countVal + tx.amount)

    setAccepting(true)
    setShowCoins(true)

    // Count up after coins arrive (~650 ms)
    setTimeout(() => {
      const countDuration = 600
      const startTime     = Date.now()

      const interval = setInterval(() => {
        const elapsed  = Date.now() - startTime
        const progress = Math.min(elapsed / countDuration, 1)
        const eased    = 1 - Math.pow(1 - progress, 3)   // ease-out cubic
        setCountVal(startVal + (endVal - startVal) * eased)

        if (progress >= 1) {
          clearInterval(interval)
          setCountVal(endVal)

          // Brief pause then close
          setTimeout(() => {
            setClosing(true)
            setTimeout(() => {
              setQueue((q) => q.slice(1))
              setAccepting(false)
              setClosing(false)
              setShowCoins(false)
            }, 350)
          }, 400)
        }
      }, 16)
    }, 650)
  }

  const current = queue[0]
  if (!current) return null

  const cfg = SOURCE_CONFIG[current.source as keyof typeof SOURCE_CONFIG] ?? SOURCE_CONFIG.allowance

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <div className="relative max-w-xs w-full">

        {/* Card */}
        <div className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-8 shadow-2xl text-center space-y-4
          ${closing ? 'animate-shrink-out' : 'animate-bounce-in'}`}
        >
          {/* Savings counter — coins fly toward here */}
          <div className="rounded-2xl bg-white/70 px-4 py-3 space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">My Savings</p>
            <p className="text-3xl font-bold text-sprout-700 money tabular-nums">
              ${countVal.toFixed(2)}
            </p>
          </div>

          {/* Source icon */}
          <div className="text-5xl leading-none">{cfg.icon}</div>

          {/* Headline + message */}
          <div>
            <p className="text-xl font-bold text-gray-800">{cfg.headline}</p>
            <p className="text-sm text-gray-500 mt-1">{cfg.message}</p>
          </div>

          {/* Amount — always green */}
          <p className="text-5xl font-bold money text-emerald-500">
            +${current.amount.toFixed(2)}
          </p>

          {/* Optional note */}
          {current.note && (
            <p className="text-sm text-gray-400 italic">"{current.note}"</p>
          )}

          {/* Accept button */}
          <button
            onClick={handleAccept}
            disabled={accepting}
            className={`w-full ${cfg.btn} text-white font-bold py-3.5 rounded-2xl text-lg transition-colors disabled:opacity-50`}
          >
            Add to My Tree! 🌱
          </button>

          {queue.length > 1 && (
            <p className="text-xs text-gray-400">
              {queue.length - 1} more reward{queue.length > 2 ? 's' : ''} waiting…
            </p>
          )}
        </div>

        {/* Coins — fly from button up toward the savings counter */}
        {showCoins && COINS.map((c, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top:        '74%',
              left:       '50%',
              marginLeft: '-22px',
              marginTop:  '-22px',
              '--tx': `${c.dx}px`,
              '--ty': `${c.dy}px`,
              '--cs': c.cs,
              animation: `coin-deposit 1s ease-in ${c.delay}s forwards`,
            } as React.CSSProperties}
          >
            <CoinSvg />
          </div>
        ))}
      </div>
    </div>
  )
}

function CoinSvg() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
      <circle cx="22" cy="22" r="16" fill="#fcd34d"/>
      <circle cx="15" cy="15" r="4.5" fill="#fde68a" opacity="0.7"/>
      <text x="22" y="28" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#92400e">$</text>
    </svg>
  )
}
