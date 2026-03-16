'use client'

import { useState, useEffect } from 'react'
import type { Transaction } from '@/lib/db/types'

const SOURCE_CONFIG = {
  allowance: {
    headline: 'Allowance Day!',
    message:  'You showed up and earned it. Keep it up!',
    bg:       'bg-sprout-50',
    border:   'border-sprout-200',
    accent:   'text-sprout-700',
    btn:      'bg-sprout-500 hover:bg-sprout-600',
    icon:     '💵',
  },
  gift: {
    headline: 'You Got a Gift!',
    message:  'Someone special is thinking of you!',
    bg:       'bg-pink-50',
    border:   'border-pink-200',
    accent:   'text-pink-700',
    btn:      'bg-pink-500 hover:bg-pink-600',
    icon:     '🎁',
  },
  interest: {
    headline: 'Your Money Grew!',
    message:  'Your savings earned interest — money makes money!',
    bg:       'bg-sky-50',
    border:   'border-sky-200',
    accent:   'text-sky-700',
    btn:      'bg-sky-500 hover:bg-sky-600',
    icon:     '📈',
  },
  jobs: {
    headline: 'Hard Work Pays Off!',
    message:  'You earned this with your effort. Well done!',
    bg:       'bg-amber-50',
    border:   'border-amber-200',
    accent:   'text-amber-700',
    btn:      'bg-amber-500 hover:bg-amber-600',
    icon:     '⭐',
  },
} as const

// 8 coin burst trajectories
const COINS = [
  { dx: -90, dy: -110, delay: 0     },
  { dx: -50, dy: -140, delay: 0.06  },
  { dx:   0, dy: -155, delay: 0.04  },
  { dx:  50, dy: -140, delay: 0.08  },
  { dx:  90, dy: -110, delay: 0.02  },
  { dx: -70, dy:  -80, delay: 0.10  },
  { dx:  70, dy:  -80, delay: 0.05  },
  { dx:  20, dy: -125, delay: 0.07  },
]

interface Props {
  childId:      string
  transactions: Transaction[]
}

export default function TransactionNotifications({ childId, transactions }: Props) {
  const [queue,      setQueue]      = useState<Transaction[]>([])
  const [accepting,  setAccepting]  = useState(false)
  const [showCoins,  setShowCoins]  = useState(false)

  useEffect(() => {
    try {
      const key    = `cs_ack_txns_${childId}`
      const stored = localStorage.getItem(key)
      const income = transactions.filter((t) => t.amount > 0)

      if (stored === null) {
        // First load — mark everything as already seen; no pop-ups
        localStorage.setItem(key, JSON.stringify(income.map((t) => t.id)))
        return
      }

      const acknowledged: string[] = JSON.parse(stored)
      const pending = income.filter((t) => !acknowledged.includes(t.id))
      if (pending.length > 0) setQueue(pending)
    } catch {
      // localStorage unavailable or corrupted — skip notifications
    }
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

    setAccepting(true)
    setShowCoins(true)

    setTimeout(() => {
      setQueue((q)  => q.slice(1))
      setAccepting(false)
      setShowCoins(false)
    }, 1300)
  }

  const current = queue[0]
  if (!current) return null

  const cfg = SOURCE_CONFIG[current.source as keyof typeof SOURCE_CONFIG] ?? SOURCE_CONFIG.allowance

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      {/* Wrapper — overflow:visible so coins can fly out */}
      <div className="relative max-w-xs w-full">

        {/* Card */}
        <div className={`rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-8 shadow-2xl text-center space-y-5
          ${accepting ? 'animate-shrink-out' : 'animate-bounce-in'}`}
        >
          {/* Big icon */}
          <div className="text-6xl leading-none">{cfg.icon}</div>

          {/* Text */}
          <div>
            <p className="text-xl font-bold text-gray-800">{cfg.headline}</p>
            <p className="text-sm text-gray-500 mt-1">{cfg.message}</p>
          </div>

          {/* Amount */}
          <p className={`text-5xl font-bold money ${cfg.accent}`}>+${current.amount.toFixed(2)}</p>

          {/* Note */}
          {current.note && (
            <p className="text-sm text-gray-400 italic">"{current.note}"</p>
          )}

          {/* Button */}
          <button
            onClick={handleAccept}
            disabled={accepting}
            className={`w-full ${cfg.btn} text-white font-bold py-3.5 rounded-2xl text-lg transition-colors disabled:opacity-50`}
          >
            Add to My Tree! 🌱
          </button>

          {/* Queue count */}
          {queue.length > 1 && (
            <p className="text-xs text-gray-400">{queue.length - 1} more reward{queue.length > 2 ? 's' : ''} waiting…</p>
          )}
        </div>

        {/* Coins — positioned relative to wrapper, fly upward */}
        {showCoins && COINS.map((c, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top:  '50%',
              left: '50%',
              marginTop:  '-14px',
              marginLeft: '-14px',
              '--tx': `${c.dx}px`,
              '--ty': `${c.dy}px`,
              animation: `coin-fly 1.1s ease-out ${c.delay}s forwards`,
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
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="10" fill="#fcd34d"/>
      <circle cx="10" cy="10" r="3"  fill="#fde68a" opacity="0.7"/>
      <text x="14" y="18.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">$</text>
    </svg>
  )
}
