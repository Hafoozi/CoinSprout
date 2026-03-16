'use client'

import React, { useState, useEffect } from 'react'
import type { TreeStage, FruitCluster } from '@/types/domain'
import type { MilestoneType } from '@/types/database'
import AnimalIcon from '@/components/ui/animal-icon'

interface Props {
  stage:              TreeStage
  fruitClusters:      FruitCluster[]
  unlockedMilestones: MilestoneType[]
  childId:            string
}

const MILESTONE_ORDER: MilestoneType[] = ['bunny', 'bird', 'deer', 'owl', 'fox']

// Positions for unlocked animals overlaid on the tree container (% based)
const ANIMAL_OVERLAY: Record<MilestoneType, { style: React.CSSProperties; size: number }> = {
  bunny: { style: { left: '3%',  bottom: '5%' }, size: 44 },
  bird:  { style: { right: '8%', top:    '8%' }, size: 38 },
  deer:  { style: { right: '2%', bottom: '4%' }, size: 46 },
  owl:   { style: { left: '8%',  top:   '12%' }, size: 38 },
  fox:   { style: { left: '28%', bottom: '4%' }, size: 44 },
}

const FRUIT_COLOR_HEX: Record<string, string> = {
  green:     '#16a34a',
  red:       '#dc2626',
  silver:    '#c0c0c0',
  gold:      '#d97706',
  sparkling: '#a855f7',
}

// ─── Fruit positions — kept well inside each canopy's safe zone ─────────────
// Sapling  canopy cy=178 ry=62  → safe y 148–205
// Young    canopy cy=168 ry=74  → safe y 130–220
// Growing  canopy cy=158 ry=84  → safe y 112–215
// Mature   canopy cy=148 ry=100 → safe y  95–205
// Ancient  canopy cy=132 ry=114 → safe y  78–195
const STAGE_FRUIT_POS: Record<TreeStage, Array<{ x: number; y: number }>> = {
  sapling: [
    { x: 150, y: 158 }, { x: 170, y: 163 },
    { x: 148, y: 180 }, { x: 172, y: 184 },
  ],
  young: [
    { x: 145, y: 138 }, { x: 172, y: 142 },
    { x: 130, y: 160 }, { x: 188, y: 158 },
    { x: 148, y: 178 }, { x: 174, y: 180 },
    { x: 138, y: 198 }, { x: 180, y: 195 },
  ],
  growing: [
    { x: 142, y: 118 }, { x: 168, y: 112 }, { x: 195, y: 122 },
    { x: 125, y: 142 }, { x: 158, y: 134 }, { x: 192, y: 138 },
    { x: 138, y: 162 }, { x: 165, y: 158 }, { x: 200, y: 162 },
    { x: 148, y: 182 }, { x: 175, y: 178 }, { x: 215, y: 172 },
  ],
  mature: [
    { x: 122, y: 108 }, { x: 152, y:  98 }, { x: 185, y: 102 }, { x: 215, y: 112 },
    { x: 108, y: 130 }, { x: 145, y: 122 }, { x: 178, y: 125 }, { x: 212, y: 132 },
    { x: 115, y: 155 }, { x: 152, y: 145 }, { x: 188, y: 148 }, { x: 225, y: 155 },
    { x: 128, y: 175 }, { x: 162, y: 168 }, { x: 198, y: 170 }, { x: 232, y: 168 },
  ],
  ancient: [
    { x: 108, y: 100 }, { x: 138, y:  88 }, { x: 165, y:  82 }, { x: 195, y:  90 }, { x: 225, y: 102 },
    { x:  92, y: 122 }, { x: 125, y: 112 }, { x: 158, y: 105 }, { x: 192, y: 112 }, { x: 222, y: 122 },
    { x:  98, y: 145 }, { x: 130, y: 135 }, { x: 162, y: 128 }, { x: 196, y: 135 }, { x: 228, y: 145 },
    { x: 105, y: 165 }, { x: 138, y: 155 }, { x: 170, y: 150 }, { x: 205, y: 158 }, { x: 238, y: 165 },
  ],
}

// ─── Apple SVG ───────────────────────────────────────────────────────────────
// NOTE: outer <g> handles SVG position; inner <g> handles CSS animation.
// Combining both on one element causes CSS transform to override the SVG
// transform attribute in some browsers, collapsing all apples to (0,0).
function Apple({ x, y, color, sparkling = false }: { x: number; y: number; color: string; sparkling?: boolean }) {
  return (
    <g transform={`translate(${x - 7}, ${y - 8})`}>
      <g className="fruit-bob">
        {/* Stem */}
        <path d="M7 1.5 Q7.5 -0.5 9.5 0.8" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Leaf */}
        <path d="M7 1.5 Q10.5 -1 12 2" stroke="#16a34a" strokeWidth="1.2" fill="#22c55e"/>
        {/* Round body */}
        <circle cx="7" cy="8.5" r="6.5" fill={color}/>
        {/* Top cleft */}
        <path d="M4.5 3.5 Q7 2.5 9.5 3.5" fill="none" stroke="rgba(0,0,0,0.13)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Highlight */}
        <circle cx="4" cy="6.5" r="1.8" fill="white" opacity="0.32"/>
        {/* Sparkle stars for $1000 apple */}
        {sparkling && <>
          <text x="12.5" y="3"   fontSize="4" textAnchor="middle" fill="#fde68a">✦</text>
          <text x="-0.5" y="5"   fontSize="3" textAnchor="middle" fill="#fde68a">✦</text>
          <text x="14"   y="10"  fontSize="3" textAnchor="middle" fill="#fde68a">✦</text>
        </>}
      </g>
    </g>
  )
}

// ─── Tree SVG ────────────────────────────────────────────────────────────────
function TreeSvg({ stage, fruitClusters }: { stage: TreeStage; fruitClusters: FruitCluster[] }) {
  const positions = STAGE_FRUIT_POS[stage]
  const maxSlots  = positions.length

  // Interleave fruits round-robin across clusters so colours spread evenly
  const flatFruits: { color: string; sparkling: boolean }[] = []
  const buckets = fruitClusters.map(c => ({
    color:     FRUIT_COLOR_HEX[c.color] ?? '#16a34a',
    sparkling: c.color === 'sparkling',
    count:     c.count,
  }))

  while (flatFruits.length < maxSlots) {
    const before = flatFruits.length
    for (const b of buckets) {
      if (flatFruits.length >= maxSlots) break
      if (b.count > 0) {
        flatFruits.push({ color: b.color, sparkling: b.sparkling })
        b.count--
      }
    }
    if (flatFruits.length === before) break
  }

  const trunk  = '#78350f'
  const dark   = '#451a03'

  return (
    <svg viewBox="0 0 320 265" width="100%" style={{ maxHeight: 280, display: 'block' }}>

      {/* ── Sapling ($0–$49) ── */}
      {stage === 'sapling' && <>
        <rect x="152" y="202" width="16" height="58" rx="4" fill={trunk}/>
        <ellipse cx="160" cy="178" rx="50"  ry="62"  fill="#22c55e"/>
        <ellipse cx="160" cy="158" rx="36"  ry="42"  fill="#4ade80" opacity="0.45"/>
        <ellipse cx="152" cy="170" rx="22"  ry="28"  fill="#86efac" opacity="0.3"/>
      </>}

      {/* ── Young ($50–$199) ── */}
      {stage === 'young' && <>
        <rect x="149" y="196" width="22" height="64" rx="5" fill={trunk}/>
        <ellipse cx="160" cy="168" rx="65"  ry="74"  fill="#16a34a"/>
        <ellipse cx="142" cy="150" rx="46"  ry="52"  fill="#22c55e" opacity="0.5"/>
        <ellipse cx="178" cy="152" rx="44"  ry="50"  fill="#22c55e" opacity="0.45"/>
        <ellipse cx="160" cy="136" rx="38"  ry="42"  fill="#4ade80" opacity="0.35"/>
      </>}

      {/* ── Growing ($200–$499) ── */}
      {stage === 'growing' && <>
        <path d="M149 257 Q139 248 130 256" stroke={trunk} strokeWidth="3"   fill="none" strokeLinecap="round"/>
        <path d="M171 257 Q181 248 190 256" stroke={trunk} strokeWidth="3"   fill="none" strokeLinecap="round"/>
        <rect x="146" y="186" width="28"  height="72" rx="6" fill={trunk}/>
        <ellipse cx="160" cy="158" rx="80"  ry="84"  fill="#15803d"/>
        <ellipse cx="133" cy="140" rx="56"  ry="60"  fill="#16a34a" opacity="0.5"/>
        <ellipse cx="187" cy="138" rx="54"  ry="58"  fill="#16a34a" opacity="0.45"/>
        <ellipse cx="160" cy="118" rx="48"  ry="50"  fill="#4ade80" opacity="0.3"/>
      </>}

      {/* ── Mature ($500–$999) ── */}
      {stage === 'mature' && <>
        <path d="M142 258 Q128 244 118 254" stroke={trunk} strokeWidth="4"   fill="none" strokeLinecap="round"/>
        <path d="M178 258 Q192 244 202 254" stroke={trunk} strokeWidth="4"   fill="none" strokeLinecap="round"/>
        <path d="M152 242 Q144 228 135 236" stroke={trunk} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M168 242 Q176 228 185 236" stroke={trunk} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <rect x="142" y="178" width="36"  height="80" rx="7" fill={trunk}/>
        <ellipse cx="160" cy="148" rx="96"  ry="100" fill="#14532d"/>
        <ellipse cx="118" cy="128" rx="68"  ry="72"  fill="#15803d" opacity="0.55"/>
        <ellipse cx="202" cy="126" rx="65"  ry="70"  fill="#15803d" opacity="0.5"/>
        <ellipse cx="160" cy="105" rx="60"  ry="64"  fill="#166534" opacity="0.4"/>
        <ellipse cx="160" cy="150" rx="80"  ry="66"  fill="#14532d" opacity="0.25"/>
      </>}

      {/* ── Ancient ($1000+) ── */}
      {stage === 'ancient' && <>
        <path d="M142 260 Q124 242 108 252" stroke={dark} strokeWidth="5"   fill="none" strokeLinecap="round"/>
        <path d="M178 260 Q196 242 212 252" stroke={dark} strokeWidth="5"   fill="none" strokeLinecap="round"/>
        <path d="M150 246 Q136 228 122 238" stroke={dark} strokeWidth="4"   fill="none" strokeLinecap="round"/>
        <path d="M170 246 Q184 228 198 238" stroke={dark} strokeWidth="4"   fill="none" strokeLinecap="round"/>
        <path d="M155 254 Q148 240 140 248" stroke={dark} strokeWidth="3"   fill="none" strokeLinecap="round"/>
        <path d="M134 262 Q129 220 137 184 L163 178 L183 184 Q191 220 186 262 Z" fill={dark}/>
        <path d="M148 262 Q146 230 148 198" stroke={trunk} strokeWidth="2"  fill="none" opacity="0.4" strokeLinecap="round"/>
        <path d="M162 262 Q164 230 162 184" stroke={trunk} strokeWidth="2"  fill="none" opacity="0.4" strokeLinecap="round"/>
        <ellipse cx="160" cy="132" rx="120" ry="114" fill="#052e16"/>
        <ellipse cx="100" cy="108" rx="76"  ry="80"  fill="#052e16" opacity="0.6"/>
        <ellipse cx="220" cy="106" rx="73"  ry="77"  fill="#052e16" opacity="0.55"/>
        <ellipse cx="160" cy="82"  rx="68"  ry="72"  fill="#064e3b" opacity="0.5"/>
        <ellipse cx="155" cy="130" rx="88"  ry="70"  fill="#052e16" opacity="0.28"/>
        <ellipse cx="128" cy="88"  rx="30"  ry="28"  fill="#065f46" opacity="0.4"/>
        <ellipse cx="192" cy="86"  rx="28"  ry="26"  fill="#065f46" opacity="0.35"/>
      </>}

      {/* ── Fruit ── */}
      {flatFruits.map((f, i) => {
        const p = positions[i]
        if (!p) return null
        return <Apple key={i} x={p.x} y={p.y} color={f.color} sparkling={f.sparkling}/>
      })}

      {/* Ground shadow */}
      <ellipse cx="160" cy="260" rx="56" ry="6" fill="#15803d" opacity="0.22"/>
    </svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function TreeHero({ stage, fruitClusters, unlockedMilestones, childId }: Props) {
  const [celebrating, setCelebrating] = useState<MilestoneType | null>(null)
  const [revealed,    setRevealed]    = useState(false)

  useEffect(() => {
    try {
      const key  = `cs_celebrated_${childId}`
      const raw  = localStorage.getItem(key)
      const done: MilestoneType[] = raw ? JSON.parse(raw) : []
      const next = unlockedMilestones.find(m => !done.includes(m))
      if (next) setCelebrating(next)
    } catch {
      // localStorage unavailable or corrupted — skip celebration
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId])

  function handleReveal() {
    setRevealed(true)
  }

  function handleClose() {
    if (!celebrating) return
    const key  = `cs_celebrated_${childId}`
    let done: MilestoneType[] = []
    try { done = JSON.parse(localStorage.getItem(key) ?? '[]') } catch { /* ignore */ }
    const updated = [...done, celebrating]
    try { localStorage.setItem(key, JSON.stringify(updated)) } catch { /* ignore */ }

    setRevealed(false)
    setCelebrating(null)

    // Brief pause before showing the next celebration
    const next = unlockedMilestones.find(m => !updated.includes(m))
    if (next) setTimeout(() => setCelebrating(next), 800)
  }

  function resetCelebrations() {
    try { localStorage.removeItem(`cs_celebrated_${childId}`) } catch { /* ignore */ }
    setRevealed(false)
    const first = unlockedMilestones[0] ?? null
    setCelebrating(first)
  }

  return (
    <div>
      {/* Tree + animals */}
      <div className="relative">
        <TreeSvg stage={stage} fruitClusters={fruitClusters}/>
        {MILESTONE_ORDER.filter(type => unlockedMilestones.includes(type)).map(type => (
          <div
            key={type}
            className="absolute pointer-events-none drop-shadow-sm"
            style={ANIMAL_OVERLAY[type].style}
          >
            <AnimalIcon type={type} size={ANIMAL_OVERLAY[type].size}/>
          </div>
        ))}
      </div>

      {/* Dev-only reset button for testing celebrations */}
      {process.env.NODE_ENV === 'development' && unlockedMilestones.length > 0 && (
        <div className="flex justify-end mb-1">
          <button
            onClick={resetCelebrations}
            className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
          >
            ↺ reset celebrations
          </button>
        </div>
      )}

      {/* Milestone badge row */}
      <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-100">
        {MILESTONE_ORDER.map((type) => {
          const unlocked = unlockedMilestones.includes(type)
          return (
            <div key={type} className={`rounded-full p-1 transition-all ${unlocked ? 'bg-sprout-50 ring-2 ring-sprout-200' : 'bg-gray-50'}`}>
              <AnimalIcon type={type} size={36} muted={!unlocked}/>
            </div>
          )
        })}
      </div>

      {/* Gift-box celebration modal */}
      {celebrating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="relative max-w-xs w-full rounded-3xl border-2 border-sprout-200 bg-sprout-50 p-8 shadow-2xl text-center space-y-5 animate-bounce-in">

            {!revealed ? (
              <>
                <p className="text-xl font-bold text-gray-800">A new friend is waiting!</p>
                <p className="text-sm text-gray-500">Tap the gift to reveal who it is!</p>
                <button
                  onClick={handleReveal}
                  className="text-7xl leading-none block mx-auto focus:outline-none animate-gift-wiggle"
                  aria-label="Reveal your new friend"
                >
                  🎁
                </button>
                <p className="text-xs text-gray-400">You earned this by saving!</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-gray-800">Meet your new friend!</p>
                <div className="flex justify-center py-2">
                  <AnimalIcon type={celebrating} size={96}/>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-sprout-500 hover:bg-sprout-600 text-white font-bold py-3.5 rounded-2xl text-lg transition-colors"
                >
                  Yay! 🌟
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
