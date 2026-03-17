'use client'

import React, { useState, useEffect } from 'react'
import type { TreeStage, FruitCluster } from '@/types/domain'
import type { MilestoneType } from '@/types/database'
import AnimalIcon from '@/components/ui/animal-icon'
import TreeAnimalSprite from '@/components/tree/tree-animal-sprite'
import { APPLE_HEX } from '@/lib/constants/fruit-colors'

interface Props {
  stage:              TreeStage
  fruitClusters:      FruitCluster[]
  unlockedMilestones: MilestoneType[]
  childId:            string
}

const MILESTONE_ORDER: MilestoneType[] = ['bunny', 'bird', 'deer', 'owl', 'fox']

const ANIMAL_OVERLAY: Record<MilestoneType, { style: React.CSSProperties; size: number }> = {
  bunny: { style: { left: '2%',  bottom: '4%' }, size: 52 },
  bird:  { style: { right: '6%', top:    '6%' }, size: 46 },
  deer:  { style: { right: '1%', bottom: '3%' }, size: 56 },
  owl:   { style: { left: '6%',  top:   '10%' }, size: 46 },
  fox:   { style: { left: '26%', bottom: '3%' }, size: 52 },
}


// ─── Fruit positions ──────────────────────────────────────────────────────────
const STAGE_FRUIT_POS: Record<TreeStage, Array<{ x: number; y: number }>> = {
  // Tiny canopy ~cx=160,cy=190,rx=22 — 4 snug slots
  sapling: [
    { x: 153, y: 181 }, { x: 167, y: 184 },
    { x: 151, y: 194 }, { x: 169, y: 197 },
  ],
  // Round canopy ~cx=160,cy=168,rx=52 — 8 slots
  young: [
    { x: 143, y: 148 }, { x: 162, y: 143 }, { x: 178, y: 150 },
    { x: 135, y: 163 }, { x: 160, y: 159 }, { x: 182, y: 162 },
    { x: 143, y: 177 }, { x: 170, y: 178 },
  ],
  // Three-lobed canopy, spreads x≈105–215 — 12 slots
  growing: [
    { x: 130, y: 110 }, { x: 160, y: 104 }, { x: 190, y: 112 },
    { x: 108, y: 134 }, { x: 142, y: 124 }, { x: 174, y: 126 }, { x: 206, y: 132 },
    { x: 118, y: 156 }, { x: 150, y: 148 }, { x: 182, y: 150 }, { x: 212, y: 156 },
    { x: 136, y: 175 },
  ],
  // Wide umbrella canopy, x≈75–245 — 16 slots
  mature: [
    { x: 105, y:  88 }, { x: 140, y:  78 }, { x: 182, y:  82 }, { x: 215, y:  95 },
    { x:  88, y: 112 }, { x: 125, y: 102 }, { x: 162, y:  98 }, { x: 200, y: 108 },
    { x:  95, y: 135 }, { x: 130, y: 124 }, { x: 168, y: 120 }, { x: 205, y: 130 },
    { x: 108, y: 155 }, { x: 145, y: 148 }, { x: 182, y: 150 }, { x: 218, y: 155 },
  ],
  // Massive canopy, fills frame — 20 slots
  ancient: [
    { x: 100, y:  58 }, { x: 138, y:  46 }, { x: 165, y:  42 }, { x: 202, y:  52 },
    { x:  72, y:  82 }, { x: 112, y:  70 }, { x: 150, y:  66 }, { x: 188, y:  72 }, { x: 228, y:  80 },
    { x:  78, y: 108 }, { x: 118, y:  95 }, { x: 158, y:  90 }, { x: 198, y:  96 }, { x: 238, y: 106 },
    { x:  88, y: 132 }, { x: 130, y: 120 }, { x: 170, y: 116 }, { x: 210, y: 124 },
    { x: 105, y: 152 }, { x: 175, y: 148 },
  ],
}

// ─── Sky system ───────────────────────────────────────────────────────────────

type SkyPhase = 'night' | 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk'

interface SkyColors {
  sky1: string; sky2: string; sky3: string
  ground1: string; ground2: string
  sunColor: string; sunR: number; sunGlow: string
  cloudFill: string; cloudOpacity: number
  showClouds: boolean
}

const PHASE_COLORS: Record<SkyPhase, SkyColors> = {
  night: {
    sky1: '#020b18', sky2: '#061a38', sky3: '#0d2448',
    ground1: '#122a0c', ground2: '#0a1808',
    sunColor: 'none', sunR: 0, sunGlow: 'none',
    cloudFill: 'white', cloudOpacity: 0, showClouds: false,
  },
  dawn: {
    sky1: '#160830', sky2: '#902040', sky3: '#e05810',
    ground1: '#1e380e', ground2: '#14250a',
    sunColor: '#ff6020', sunR: 15, sunGlow: '#ff7030',
    cloudFill: '#ffb080', cloudOpacity: 0.4, showClouds: true,
  },
  morning: {
    sky1: '#1870d0', sky2: '#54aaf0', sky3: '#c0e4fc',
    ground1: '#3a7820', ground2: '#285a14',
    sunColor: '#ffe040', sunR: 11, sunGlow: '#ffed80',
    cloudFill: 'white', cloudOpacity: 0.88, showClouds: true,
  },
  midday: {
    sky1: '#0d47a1', sky2: '#1e88e5', sky3: '#82c4f8',
    ground1: '#488820', ground2: '#346018',
    sunColor: '#fffde7', sunR: 10, sunGlow: '#fff9c4',
    cloudFill: 'white', cloudOpacity: 0.75, showClouds: true,
  },
  afternoon: {
    sky1: '#1455a0', sky2: '#3490e0', sky3: '#c8e4f8',
    ground1: '#488820', ground2: '#346018',
    sunColor: '#ffd54f', sunR: 11, sunGlow: '#ffca28',
    cloudFill: 'white', cloudOpacity: 0.82, showClouds: true,
  },
  dusk: {
    sky1: '#180428', sky2: '#8c1818', sky3: '#d85f10',
    ground1: '#1e3210', ground2: '#12200a',
    sunColor: '#ff4400', sunR: 15, sunGlow: '#ff5520',
    cloudFill: '#ff9050', cloudOpacity: 0.45, showClouds: true,
  },
}

// 20 fixed star positions: [x, y, radius, twinkle-delay-s]
const STARS: [number, number, number, number][] = [
  [25,  15, 1.5, 0.0], [60,   8, 1.0, 1.2], [98,  22, 1.2, 0.5],
  [132, 10, 1.5, 2.0], [168,  5, 1.0, 0.8], [205, 18, 1.3, 1.5],
  [242,  9, 1.5, 0.3], [278, 22, 1.0, 1.8], [308, 12, 1.2, 0.6],
  [48,  38, 1.0, 2.3], [90,  46, 1.2, 1.0], [142, 34, 1.5, 1.7],
  [188, 42, 1.0, 0.4], [222, 30, 1.3, 2.1], [262, 50, 1.0, 0.9],
  [296, 38, 1.5, 1.3], [15,  55, 1.0, 1.6], [78,  62, 1.2, 2.4],
  [158, 55, 1.0, 0.7], [290, 58, 1.3, 1.1],
]

function getSkyPhase(h: number): SkyPhase {
  if (h >= 5  && h < 7)  return 'dawn'
  if (h >= 7  && h < 11) return 'morning'
  if (h >= 11 && h < 14) return 'midday'
  if (h >= 14 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'dusk'
  return 'night'
}

// t = 0 at 5am, 1 at 8pm (15 hours of daylight arc)
function getDaytimeT(h: number, m: number): number {
  return Math.max(0, Math.min(1, (h + m / 60 - 5) / 15))
}

// Sun arc: left horizon → high center → right horizon
// viewBox is 320×265; sky ends at y≈228
function getSunPos(t: number): { x: number; y: number } {
  return {
    x: 20 + t * 280,
    y: 210 - 178 * Math.sin(t * Math.PI),
  }
}

// ─── Apple SVG ───────────────────────────────────────────────────────────────
function Apple({ x, y, color, sparkling = false }: { x: number; y: number; color: string; sparkling?: boolean }) {
  return (
    <g transform={`translate(${x - 7}, ${y - 8})`}>
      <g className="fruit-bob">
        <path d="M7 1.5 Q7.5 -0.5 9.5 0.8" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M7 1.5 Q10.5 -1 12 2" stroke="#16a34a" strokeWidth="1.2" fill="#22c55e"/>
        <circle cx="7" cy="8.5" r="6.5" fill={color} stroke={sparkling ? '#f59e0b' : 'none'} strokeWidth={sparkling ? 0.9 : 0}/>
        <path d="M4.5 3.5 Q7 2.5 9.5 3.5" fill="none" stroke={sparkling ? 'rgba(245,158,11,0.3)' : 'rgba(0,0,0,0.13)'} strokeWidth="2.5" strokeLinecap="round"/>
        {!sparkling && <circle cx="4" cy="6.5" r="1.8" fill="white" opacity="0.32"/>}
        {sparkling && <text x="7" y="12.5" textAnchor="middle" fontSize="9" fill="#f59e0b">★</text>}
      </g>
    </g>
  )
}

// ─── Tree + Sky SVG ───────────────────────────────────────────────────────────
function TreeSvg({
  stage, fruitClusters, phase, daytimeT,
}: {
  stage: TreeStage; fruitClusters: FruitCluster[]
  phase: SkyPhase;  daytimeT: number
}) {
  const positions = STAGE_FRUIT_POS[stage]
  const maxSlots  = positions.length
  const c         = PHASE_COLORS[phase]
  const isNight   = phase === 'night'
  const isDawnDusk = phase === 'dawn' || phase === 'dusk'
  const sun       = getSunPos(daytimeT)

  // Interleave fruits across clusters
  const flatFruits: { color: string; sparkling: boolean }[] = []
  const buckets = fruitClusters.map(b => ({
    color:     APPLE_HEX[b.color] ?? '#16a34a',
    sparkling: b.color === 'sparkling',
    count:     b.count,
  }))
  while (flatFruits.length < maxSlots) {
    const before = flatFruits.length
    for (const b of buckets) {
      if (flatFruits.length >= maxSlots) break
      if (b.count > 0) { flatFruits.push({ color: b.color, sparkling: b.sparkling }); b.count-- }
    }
    if (flatFruits.length === before) break
  }

  const trunk = '#78350f'
  const dark  = '#451a03'

  return (
    <svg viewBox="0 0 320 265" width="100%" style={{ display: 'block' }}>
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="228" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={c.sky1}/>
          <stop offset="55%"  stopColor={c.sky2}/>
          <stop offset="100%" stopColor={c.sky3}/>
        </linearGradient>
        {/* Ground gradient */}
        <linearGradient id="groundGrad" x1="0" y1="228" x2="0" y2="265" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={c.ground1}/>
          <stop offset="100%" stopColor={c.ground2}/>
        </linearGradient>
        {/* Sun glow (radial, centered on sun) */}
        {!isNight && (
          <radialGradient id="sunGlowGrad" cx={sun.x} cy={sun.y} r={c.sunR * 3.5} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={c.sunGlow} stopOpacity="0.55"/>
            <stop offset="100%" stopColor={c.sunGlow} stopOpacity="0"/>
          </radialGradient>
        )}
        {/* Horizon glow for dawn/dusk */}
        {isDawnDusk && (
          <radialGradient id="horizonGlow" cx="160" cy="228" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={c.sunGlow} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={c.sunGlow} stopOpacity="0"/>
          </radialGradient>
        )}
      </defs>

      {/* ── Sky background ── */}
      <rect x="0" y="0" width="320" height="228" fill="url(#skyGrad)"/>

      {/* ── Ground ── */}
      <rect x="0" y="225" width="320" height="40" fill="url(#groundGrad)"/>

      {/* ── Stars (night only) ── */}
      {isNight && STARS.map(([x, y, r, delay], i) => (
        <circle
          key={i} cx={x} cy={y} r={r}
          fill="white"
          style={{ animation: `star-twinkle ${1.8 + (delay % 1.2)}s ease-in-out ${delay}s infinite` }}
        />
      ))}

      {/* ── Moon (night) ── */}
      {isNight && (
        <g>
          {/* Soft glow */}
          <circle cx="268" cy="36" r="30" fill="#fffff0" opacity="0.06"/>
          {/* Moon body */}
          <circle cx="268" cy="36" r="18" fill="#fffef0" opacity="0.95"/>
          {/* Shadow circle to carve crescent */}
          <circle cx="275" cy="31" r="14" fill={c.sky1}/>
        </g>
      )}

      {/* ── Sun glow corona (daytime) ── */}
      {!isNight && (
        <circle
          cx={sun.x} cy={sun.y} r={c.sunR * 3.2}
          fill="url(#sunGlowGrad)"
          style={{ animation: 'sun-glow-pulse 3.5s ease-in-out infinite' }}
        />
      )}

      {/* ── Sun body (daytime) ── */}
      {!isNight && (
        <circle cx={sun.x} cy={sun.y} r={c.sunR} fill={c.sunColor}/>
      )}

      {/* ── Horizon glow (dawn / dusk) ── */}
      {isDawnDusk && (
        <rect x="0" y="175" width="320" height="55" fill="url(#horizonGlow)"/>
      )}

      {/* ── Clouds (daytime) ── */}
      {c.showClouds && (
        <>
          {/* Cloud A — left */}
          <g style={{ animation: 'cloud-drift 22s ease-in-out infinite alternate' }} opacity={c.cloudOpacity}>
            <ellipse cx="68"  cy="48" rx="30" ry="12" fill={c.cloudFill}/>
            <ellipse cx="88"  cy="42" rx="22" ry="10" fill={c.cloudFill}/>
            <ellipse cx="50"  cy="44" rx="18" ry="9"  fill={c.cloudFill}/>
          </g>
          {/* Cloud B — right */}
          <g style={{ animation: 'cloud-drift 30s ease-in-out infinite alternate-reverse' }} opacity={c.cloudOpacity * 0.85}>
            <ellipse cx="248" cy="62" rx="26" ry="11" fill={c.cloudFill}/>
            <ellipse cx="268" cy="56" rx="20" ry="9"  fill={c.cloudFill}/>
            <ellipse cx="232" cy="58" rx="16" ry="8"  fill={c.cloudFill}/>
          </g>
          {/* Cloud C — top center, only midday */}
          {phase === 'midday' && (
            <g style={{ animation: 'cloud-drift 36s ease-in-out infinite alternate' }} opacity={0.5}>
              <ellipse cx="158" cy="28" rx="22" ry="8"  fill={c.cloudFill}/>
              <ellipse cx="172" cy="24" rx="16" ry="7"  fill={c.cloudFill}/>
              <ellipse cx="144" cy="25" rx="14" ry="6"  fill={c.cloudFill}/>
            </g>
          )}
        </>
      )}

      {/* ═══════════════════ TREE SHAPES ═══════════════════════════════════ */}

      {/* ── Sapling ── tiny seedling, lots of sky visible */}
      {stage === 'sapling' && <>
        {/* Thin stem */}
        <rect x="158.5" y="203" width="3" height="25" rx="1.5" fill={trunk}/>
        {/* Side leaf nubs for seedling character */}
        <ellipse cx="144" cy="207" rx="10" ry="6" fill="#4ade80" transform="rotate(-30, 144, 207)"/>
        <ellipse cx="176" cy="207" rx="10" ry="6" fill="#4ade80" transform="rotate(30, 176, 207)"/>
        <ellipse cx="147" cy="198" rx="8"  ry="5" fill="#86efac" transform="rotate(-20, 147, 198)"/>
        <ellipse cx="173" cy="198" rx="8"  ry="5" fill="#86efac" transform="rotate(20, 173, 198)"/>
        {/* Small round top */}
        <ellipse cx="160" cy="190" rx="22" ry="25" fill="#4ade80"/>
        <ellipse cx="157" cy="183" rx="13" ry="14" fill="#86efac" opacity="0.6"/>
      </>}

      {/* ── Young ── lollipop tree, single round ball on visible trunk */}
      {stage === 'young' && <>
        <rect x="155" y="200" width="10" height="30" rx="3" fill={trunk}/>
        {/* Clean round canopy */}
        <ellipse cx="160" cy="168" rx="52" ry="56" fill="#22c55e"/>
        <ellipse cx="152" cy="156" rx="34" ry="36" fill="#4ade80" opacity="0.45"/>
        <ellipse cx="168" cy="154" rx="30" ry="33" fill="#4ade80" opacity="0.38"/>
        <ellipse cx="160" cy="145" rx="24" ry="25" fill="#86efac" opacity="0.32"/>
      </>}

      {/* ── Growing ── real tree shape, three-lobed crown, visible surface roots */}
      {stage === 'growing' && <>
        <path d="M150 225 Q140 218 130 226" stroke={trunk} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M170 225 Q180 218 190 226" stroke={trunk} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <rect x="148" y="187" width="24" height="43" rx="5.5" fill={trunk}/>
        {/* Three clearly distinct lobes */}
        <ellipse cx="160" cy="148" rx="76" ry="78" fill="#16a34a"/>
        <ellipse cx="118" cy="140" rx="55" ry="58" fill="#16a34a"/>
        <ellipse cx="202" cy="138" rx="52" ry="55" fill="#16a34a"/>
        <ellipse cx="160" cy="112" rx="45" ry="47" fill="#22c55e" opacity="0.42"/>
        <ellipse cx="138" cy="130" rx="28" ry="30" fill="#4ade80" opacity="0.22"/>
      </>}

      {/* ── Mature ── wide spreading oak, canopy much wider than tall */}
      {stage === 'mature' && <>
        {/* Pronounced root flares */}
        <path d="M143 226 Q124 214 108 224" stroke={dark}  strokeWidth="5"   fill="none" strokeLinecap="round"/>
        <path d="M177 226 Q196 214 212 224" stroke={dark}  strokeWidth="5"   fill="none" strokeLinecap="round"/>
        <path d="M150 224 Q140 212 130 220" stroke={trunk} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M170 224 Q180 212 190 220" stroke={trunk} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Wide sturdy trunk */}
        <rect x="143" y="174" width="34" height="58" rx="7" fill={trunk}/>
        {/* Wide umbrella — horizontal spread is the key visual difference */}
        <ellipse cx="160" cy="130" rx="112" ry="84" fill="#15803d"/>
        <ellipse cx="100" cy="118" rx="74"  ry="64" fill="#166534" opacity="0.55"/>
        <ellipse cx="220" cy="116" rx="70"  ry="61" fill="#166534" opacity="0.50"/>
        <ellipse cx="160" cy="90"  rx="62"  ry="56" fill="#22c55e" opacity="0.28"/>
        <ellipse cx="160" cy="138" rx="90"  ry="52" fill="#14532d" opacity="0.25"/>
      </>}

      {/* ── Ancient ── massive gnarled giant, fills the entire frame */}
      {stage === 'ancient' && <>
        {/* Heavy gnarled roots */}
        <path d="M139 260 Q118 240 96 252"  stroke={dark} strokeWidth="6"   fill="none" strokeLinecap="round"/>
        <path d="M181 260 Q202 240 224 252" stroke={dark} strokeWidth="6"   fill="none" strokeLinecap="round"/>
        <path d="M148 248 Q130 228 114 240" stroke={dark} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M172 248 Q190 228 206 240" stroke={dark} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d="M153 256 Q145 238 135 250" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Very wide massive trunk with visible bark lines */}
        <path d="M126 262 Q120 218 128 175 L172 168 L192 175 Q200 218 194 262 Z" fill={dark}/>
        <path d="M141 262 Q139 228 141 192" stroke={trunk} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
        <path d="M160 262 Q162 226 160 168" stroke={trunk} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
        {/* Enormous canopy that bleeds to the edges */}
        <ellipse cx="160" cy="112" rx="148" ry="112" fill="#052e16"/>
        <ellipse cx="82"  cy="90"  rx="84"  ry="80"  fill="#052e16" opacity="0.65"/>
        <ellipse cx="238" cy="88"  rx="80"  ry="76"  fill="#052e16" opacity="0.60"/>
        <ellipse cx="160" cy="60"  rx="76"  ry="70"  fill="#064e3b" opacity="0.55"/>
        <ellipse cx="150" cy="122" rx="98"  ry="70"  fill="#052e16" opacity="0.30"/>
        {/* Moss / light patches for age */}
        <ellipse cx="118" cy="72"  rx="38"  ry="34"  fill="#065f46" opacity="0.45"/>
        <ellipse cx="202" cy="70"  rx="34"  ry="30"  fill="#065f46" opacity="0.40"/>
        <ellipse cx="160" cy="50"  rx="28"  ry="24"  fill="#047857" opacity="0.35"/>
      </>}

      {/* ── Fruit ── */}
      {flatFruits.map((f, i) => {
        const p = positions[i]
        if (!p) return null
        return <Apple key={i} x={p.x} y={p.y} color={f.color} sparkling={f.sparkling}/>
      })}
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TreeHero({ stage, fruitClusters, unlockedMilestones, childId }: Props) {
  const [celebrating, setCelebrating] = useState<MilestoneType | null>(null)
  const [revealed,    setRevealed]    = useState(false)
  const [now,         setNow]         = useState<Date | null>(null)

  // Hydrate clock client-side only (avoids SSR mismatch)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    try {
      const key  = `cs_celebrated_${childId}`
      const raw  = localStorage.getItem(key)
      const done: MilestoneType[] = raw ? JSON.parse(raw) : []
      const next = unlockedMilestones.find(m => !done.includes(m))
      if (next) setCelebrating(next)
    } catch { /* localStorage unavailable */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId])

  const h         = now?.getHours()   ?? 12
  const m         = now?.getMinutes() ?? 0
  const phase     = getSkyPhase(h)
  const daytimeT  = getDaytimeT(h, m)

  function handleReveal() { setRevealed(true) }

  function handleClose() {
    if (!celebrating) return
    const key  = `cs_celebrated_${childId}`
    let done: MilestoneType[] = []
    try { done = JSON.parse(localStorage.getItem(key) ?? '[]') } catch { /* ignore */ }
    const updated = [...done, celebrating]
    try { localStorage.setItem(key, JSON.stringify(updated)) } catch { /* ignore */ }
    setRevealed(false)
    setCelebrating(null)
    const next = unlockedMilestones.find(m => !updated.includes(m))
    if (next) setTimeout(() => setCelebrating(next), 800)
  }

  function resetCelebrations() {
    try { localStorage.removeItem(`cs_celebrated_${childId}`) } catch { /* ignore */ }
    setRevealed(false)
    setCelebrating(unlockedMilestones[0] ?? null)
  }

  return (
    <div>
      {/* Tree + sky + animals */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <TreeSvg stage={stage} fruitClusters={fruitClusters} phase={phase} daytimeT={daytimeT}/>
        {MILESTONE_ORDER.filter(type => unlockedMilestones.includes(type)).map(type => (
          <div key={type} className="absolute drop-shadow-sm" style={ANIMAL_OVERLAY[type].style}>
            <TreeAnimalSprite type={type} size={ANIMAL_OVERLAY[type].size}/>
          </div>
        ))}
      </div>

      {/* Dev reset */}
      {process.env.NODE_ENV === 'development' && unlockedMilestones.length > 0 && (
        <div className="flex justify-end px-4 pt-1">
          <button onClick={resetCelebrations} className="text-xs text-gray-300 hover:text-gray-400 transition-colors">
            ↺ reset celebrations
          </button>
        </div>
      )}

      {/* Milestone badge row */}
      <div className="flex justify-center gap-3 px-4 py-3 border-t border-gray-100">
        {MILESTONE_ORDER.map((type) => {
          const unlocked = unlockedMilestones.includes(type)
          return (
            <div key={type} className={`rounded-full p-1 transition-all ${unlocked ? 'bg-sprout-50 ring-2 ring-sprout-200' : 'bg-gray-50'}`}>
              <AnimalIcon type={type} size={36} muted={!unlocked}/>
            </div>
          )
        })}
      </div>

      {/* Celebration modal */}
      {celebrating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="relative max-w-xs w-full rounded-3xl border-2 border-sprout-200 bg-sprout-50 p-8 shadow-2xl text-center space-y-5 animate-bounce-in">
            {!revealed ? (
              <>
                <p className="text-xl font-bold text-gray-800">A new friend is waiting!</p>
                <p className="text-sm text-gray-500">Tap the gift to reveal who it is!</p>
                <button onClick={handleReveal} className="text-7xl leading-none block mx-auto focus:outline-none animate-gift-wiggle" aria-label="Reveal your new friend">
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
                <button onClick={handleClose} className="w-full bg-sprout-500 hover:bg-sprout-600 text-white font-bold py-3.5 rounded-2xl text-lg transition-colors">
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
