'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { MilestoneType } from '@/types/database'

interface Props {
  type: MilestoneType
  size: number   // rendered width in px; height scales from viewBox
}

const ANIM: Record<MilestoneType, { cls: string; duration: number; origin: string }> = {
  bunny: { cls: 'anim-bunny-hop',     duration: 1600, origin: 'bottom center' },
  bird:  { cls: 'anim-bird-fly',      duration: 1400, origin: 'center'        },
  deer:  { cls: 'anim-deer-prance',   duration: 1600, origin: 'bottom center' },
  owl:   { cls: 'anim-owl-hoot',      duration: 1500, origin: 'center'        },
  fox:   { cls: 'anim-fox-bounce',    duration: 950,  origin: 'bottom center' },
}

export default function TreeAnimalSprite({ type, size }: Props) {
  const [animClass, setAnimClass] = useState('')
  const animating  = useRef(false)
  const scheduleId = useRef<ReturnType<typeof setTimeout>>()
  const clearId    = useRef<ReturnType<typeof setTimeout>>()

  const trigger = useCallback(() => {
    if (animating.current) return
    animating.current = true
    const { cls, duration } = ANIM[type]
    setAnimClass(cls)
    clearId.current = setTimeout(() => {
      setAnimClass('')
      animating.current = false
    }, duration)
  }, [type])

  // Random idle every 6–18 s
  useEffect(() => {
    function schedule() {
      const delay = 6000 + Math.random() * 12000
      scheduleId.current = setTimeout(() => { trigger(); schedule() }, delay)
    }
    schedule()
    return () => { clearTimeout(scheduleId.current); clearTimeout(clearId.current) }
  }, [trigger])

  const cfg = ANIM[type]

  return (
    <div
      className={`cursor-pointer select-none ${animClass}`}
      style={{ width: size, transformOrigin: cfg.origin }}
      onClick={trigger}
      title={`Click me!`}
    >
      {type === 'bunny' && <BunnySvg />}
      {type === 'bird'  && <BirdSvg  />}
      {type === 'deer'  && <DeerSvg  />}
      {type === 'owl'   && <OwlSvg   />}
      {type === 'fox'   && <FoxSvg   />}
    </div>
  )
}

// ─── Bunny (full body) ────────────────────────────────────────────────────────
function BunnySvg() {
  return (
    <svg viewBox="0 0 64 94" width="100%" height="auto">
      {/* Left ear */}
      <ellipse cx="22" cy="20" rx="8" ry="16" fill="#fce7f3"/>
      <ellipse cx="22" cy="20" rx="5" ry="11" fill="#fbcfe8"/>
      {/* Right ear */}
      <ellipse cx="42" cy="20" rx="8" ry="16" fill="#fce7f3"/>
      <ellipse cx="42" cy="20" rx="5" ry="11" fill="#fbcfe8"/>
      {/* Head */}
      <circle cx="32" cy="42" r="20" fill="#fce7f3"/>
      {/* Eyes */}
      <circle cx="24" cy="39" r="4"   fill="#1f2937"/>
      <circle cx="40" cy="39" r="4"   fill="#1f2937"/>
      <circle cx="25.5" cy="37.5" r="1.5" fill="white"/>
      <circle cx="41.5" cy="37.5" r="1.5" fill="white"/>
      {/* Nose */}
      <ellipse cx="32" cy="46" rx="3.5" ry="2.5" fill="#f9a8d4"/>
      {/* Mouth */}
      <path d="M28 49 Q32 53 36 49" stroke="#e879a8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <ellipse cx="21" cy="46" rx="5" ry="3" fill="#fda4af" opacity="0.45"/>
      <ellipse cx="43" cy="46" rx="5" ry="3" fill="#fda4af" opacity="0.45"/>
      {/* Body */}
      <ellipse cx="32" cy="73" rx="17" ry="14" fill="#fce7f3"/>
      {/* Fluffy tail */}
      <circle cx="49" cy="66" r="8" fill="white"/>
      <circle cx="49" cy="66" r="5" fill="#f9f9f9"/>
      {/* Back feet */}
      <ellipse cx="19" cy="86" rx="11" ry="6" fill="#fce7f3"/>
      <ellipse cx="45" cy="86" rx="11" ry="6" fill="#fce7f3"/>
      {/* Toe lines */}
      <path d="M11 84 Q11 88 13 88" stroke="#fbcfe8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M19 86 Q19 91 21 91" stroke="#fbcfe8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M26 84 Q27 88 29 87" stroke="#fbcfe8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Bird (full body — extended viewBox to show all feet) ─────────────────────
function BirdSvg() {
  return (
    <svg viewBox="0 0 64 72" width="100%" height="auto">
      {/* Body */}
      <ellipse cx="30" cy="46" rx="18" ry="14" fill="#7dd3fc"/>
      {/* Head */}
      <circle cx="42" cy="28" r="14" fill="#38bdf8"/>
      {/* Beak */}
      <path d="M54 26 L62 30 L54 34 Z" fill="#fbbf24"/>
      {/* Eye ring */}
      <circle cx="48" cy="24" r="5.5" fill="white"/>
      <circle cx="48" cy="24" r="3.5" fill="#1f2937"/>
      <circle cx="49.2" cy="22.8" r="1.2" fill="white"/>
      {/* Wing */}
      <path d="M14 42 Q22 32 34 38 Q28 50 14 50 Z" fill="#0ea5e9"/>
      <path d="M16 43 Q22 36 30 40" stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M16 47 Q22 40 30 44" stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.7"/>
      {/* Tail */}
      <path d="M14 46 Q6 38 10 30 Q16 40 22 48 Z" fill="#0284c7"/>
      {/* Legs */}
      <line x1="28" y1="58" x2="27" y2="66" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="58" x2="37" y2="66" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      {/* Left foot */}
      <line x1="27" y1="66" x2="22" y2="70" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27" y1="66" x2="27" y2="71" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27" y1="66" x2="32" y2="70" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right foot */}
      <line x1="37" y1="66" x2="32" y2="70" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="37" y1="66" x2="37" y2="71" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="37" y1="66" x2="42" y2="70" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Deer (full body with legs) ───────────────────────────────────────────────
function DeerSvg() {
  const brown = '#fed7aa'
  return (
    <svg viewBox="0 0 64 100" width="100%" height="auto">
      {/* Antlers */}
      <path d="M24 18 Q20 8 16 6 M20 12 Q16 10 14 6" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M40 18 Q44 8 48 6 M44 12 Q48 10 50 6" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Left ear */}
      <ellipse cx="18" cy="26" rx="8" ry="11" fill={brown}/>
      <ellipse cx="18" cy="26" rx="5" ry="7"  fill="#fda4af"/>
      {/* Right ear */}
      <ellipse cx="46" cy="26" rx="8" ry="11" fill={brown}/>
      <ellipse cx="46" cy="26" rx="5" ry="7"  fill="#fda4af"/>
      {/* Head */}
      <ellipse cx="32" cy="34" rx="16" ry="18" fill={brown}/>
      {/* Eyes */}
      <circle cx="25" cy="30" r="5"   fill="#1f2937"/>
      <circle cx="39" cy="30" r="5"   fill="#1f2937"/>
      <circle cx="26.5" cy="28.5" r="2" fill="white"/>
      <circle cx="40.5" cy="28.5" r="2" fill="white"/>
      {/* Eyelashes */}
      <path d="M22 26 L20 23 M24 25 L23 22 M27 25 L27 22" stroke="#1f2937" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M36 25 L36 22 M39 25 L40 22 M42 26 L44 23" stroke="#1f2937" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Snout */}
      <ellipse cx="32" cy="40" rx="8" ry="6" fill="#fdba74"/>
      {/* Nostrils */}
      <ellipse cx="29" cy="41" rx="1.8" ry="1.4" fill="#c2410c" opacity="0.5"/>
      <ellipse cx="35" cy="41" rx="1.8" ry="1.4" fill="#c2410c" opacity="0.5"/>
      {/* Body */}
      <ellipse cx="32" cy="62" rx="18" ry="13" fill={brown}/>
      {/* Spots */}
      <circle cx="30" cy="58" r="3"   fill="white" opacity="0.55"/>
      <circle cx="38" cy="63" r="2.5" fill="white" opacity="0.5"/>
      <circle cx="24" cy="62" r="2"   fill="white" opacity="0.45"/>
      {/* Legs — front pair */}
      <path d="M24 73 Q23 81 22 90" stroke={brown} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M30 74 Q29 82 28 90" stroke={brown} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Legs — back pair */}
      <path d="M36 74 Q37 82 38 90" stroke={brown} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M42 73 Q43 81 44 90" stroke={brown} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Hooves */}
      <ellipse cx="22" cy="91" rx="4.5" ry="3" fill="#92400e"/>
      <ellipse cx="28" cy="91" rx="4.5" ry="3" fill="#92400e"/>
      <ellipse cx="38" cy="91" rx="4.5" ry="3" fill="#92400e"/>
      <ellipse cx="44" cy="91" rx="4.5" ry="3" fill="#92400e"/>
    </svg>
  )
}

// ─── Owl (full body — extended viewBox to reveal claws) ───────────────────────
function OwlSvg() {
  return (
    <svg viewBox="0 0 64 74" width="100%" height="auto">
      {/* Body */}
      <ellipse cx="32" cy="50" rx="22" ry="18" fill="#c4b5fd"/>
      {/* Body feather lines */}
      <path d="M14 48 Q20 42 28 46" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M14 54 Q20 48 28 52" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M50 48 Q44 42 36 46" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M50 54 Q44 48 36 52" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.6"/>
      {/* Head */}
      <circle cx="32" cy="28" r="20" fill="#a78bfa"/>
      {/* Ear tufts */}
      <path d="M20 14 Q18 4 22 2 Q24 8 26 14 Z" fill="#7c3aed"/>
      <path d="M44 14 Q46 4 42 2 Q40 8 38 14 Z" fill="#7c3aed"/>
      {/* Face disk */}
      <ellipse cx="32" cy="32" rx="16" ry="13" fill="#ede9fe"/>
      {/* Eyes */}
      <circle cx="25" cy="30" r="7.5" fill="white"/>
      <circle cx="39" cy="30" r="7.5" fill="white"/>
      <circle cx="25" cy="30" r="5.5" fill="#fbbf24"/>
      <circle cx="39" cy="30" r="5.5" fill="#fbbf24"/>
      <circle cx="25" cy="30" r="3.5" fill="#1f2937"/>
      <circle cx="39" cy="30" r="3.5" fill="#1f2937"/>
      <circle cx="26.4" cy="28.6" r="1.3" fill="white"/>
      <circle cx="40.4" cy="28.6" r="1.3" fill="white"/>
      {/* Beak */}
      <path d="M28 37 L32 42 L36 37 Z" fill="#fbbf24"/>
      {/* Toe claws */}
      <path d="M24 66 L20 62 M24 66 L24 60 M24 66 L28 62" stroke="#7c3aed" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M40 66 L36 62 M40 66 L40 60 M40 66 L44 62" stroke="#7c3aed" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Fox (full body with legs + tail) ─────────────────────────────────────────
function FoxSvg() {
  const orange = '#fb923c'
  return (
    <svg viewBox="0 0 64 100" width="100%" height="auto">
      {/* Body */}
      <ellipse cx="32" cy="56" rx="18" ry="14" fill={orange}/>
      {/* Tail */}
      <path d="M48 54 Q60 46 62 56 Q62 68 52 66 Q46 64 44 56 Z" fill={orange}/>
      <path d="M54 62 Q60 66 58 72 Q52 68 50 64 Z" fill="white"/>
      {/* Left ear */}
      <path d="M18 20 L14 4  L28 14 Z" fill={orange}/>
      <path d="M19 19 L16 8  L27 15 Z" fill="#fda4af"/>
      {/* Right ear */}
      <path d="M46 20 L50 4  L36 14 Z" fill={orange}/>
      <path d="M45 19 L48 8  L37 15 Z" fill="#fda4af"/>
      {/* Head */}
      <circle cx="32" cy="30" r="20" fill={orange}/>
      {/* White forehead stripe */}
      <ellipse cx="32" cy="20" rx="6" ry="5" fill="white" opacity="0.5"/>
      {/* White muzzle */}
      <ellipse cx="32" cy="38" rx="12" ry="10" fill="#fff7ed"/>
      {/* Eyes */}
      <circle cx="24" cy="28" r="5"   fill="#1f2937"/>
      <circle cx="40" cy="28" r="5"   fill="#1f2937"/>
      <circle cx="25.5" cy="26.5" r="1.8" fill="white"/>
      <circle cx="41.5" cy="26.5" r="1.8" fill="white"/>
      {/* Nose */}
      <ellipse cx="32" cy="38" rx="4.5" ry="3" fill="#1f2937"/>
      <circle cx="30.5" cy="38" r="1.2" fill="#374151"/>
      {/* Mouth */}
      <path d="M28 42 Q32 46 36 42" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whisker dots */}
      <circle cx="20" cy="37" r="1.3" fill="#9ca3af"/>
      <circle cx="22" cy="41" r="1.3" fill="#9ca3af"/>
      <circle cx="44" cy="37" r="1.3" fill="#9ca3af"/>
      <circle cx="42" cy="41" r="1.3" fill="#9ca3af"/>
      {/* Legs */}
      <path d="M22 68 Q21 77 20 88" stroke={orange} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M28 70 Q27 79 26 88" stroke={orange} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M36 70 Q37 79 38 88" stroke={orange} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M42 68 Q43 77 44 88" stroke={orange} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Paws */}
      <ellipse cx="20" cy="89" rx="5.5" ry="4" fill={orange}/>
      <ellipse cx="26" cy="89" rx="5.5" ry="4" fill={orange}/>
      <ellipse cx="38" cy="89" rx="5.5" ry="4" fill={orange}/>
      <ellipse cx="44" cy="89" rx="5.5" ry="4" fill={orange}/>
    </svg>
  )
}
