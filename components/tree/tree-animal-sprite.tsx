'use client'

import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import type { MilestoneType } from '@/types/database'

export interface AnimalSpriteHandle {
  trigger: () => void
}

interface Props {
  type: MilestoneType
  size: number   // rendered width in px; height scales from viewBox
}

const ANIM: Record<MilestoneType, { cls: string; duration: number; origin: string }> = {
  bunny:    { cls: 'anim-bunny-hop',       duration: 1600, origin: 'bottom center' },
  bird:     { cls: 'anim-bird-fly',        duration: 1400, origin: 'center'        },
  deer:     { cls: 'anim-deer-prance',     duration: 1600, origin: 'center'        },
  owl:      { cls: 'anim-owl-hoot',        duration: 1500, origin: 'center'        },
  fox:      { cls: 'anim-fox-bounce',      duration: 950,  origin: 'bottom center' },
  squirrel: { cls: 'anim-squirrel-scurry', duration: 1800, origin: 'bottom center' },
}

const TreeAnimalSprite = forwardRef<AnimalSpriteHandle, Props>(function TreeAnimalSprite({ type, size }, ref) {
  const [animClass, setAnimClass] = useState('')
  const [active, setActive]       = useState(false)
  const guardRef   = useRef(false)
  const clearRef   = useRef<ReturnType<typeof setTimeout>>()
  const scheduleId = useRef<ReturnType<typeof setTimeout>>()

  const trigger = useCallback(() => {
    if (guardRef.current) return
    guardRef.current = true
    setActive(true)
    setAnimClass('')
    // Double-rAF ensures the browser resets the animation class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimClass(ANIM[type].cls)
      })
    })
    clearRef.current = setTimeout(() => {
      setAnimClass('')
      setActive(false)
      guardRef.current = false
    }, ANIM[type].duration + 80)
  }, [type])

  useImperativeHandle(ref, () => ({ trigger }), [trigger])

  // Random idle every 6–18 s
  useEffect(() => {
    function schedule() {
      const delay = 6000 + Math.random() * 12000
      scheduleId.current = setTimeout(() => { trigger(); schedule() }, delay)
    }
    schedule()
    return () => { clearTimeout(scheduleId.current); clearTimeout(clearRef.current) }
  }, [trigger])

  const cfg = ANIM[type]

  return (
    <div
      className={`cursor-pointer select-none ${animClass}`}
      style={{
        width: size,
        transformOrigin: cfg.origin,
        animation: !active ? 'gentle-breathe 4s ease-in-out infinite' : undefined,
      }}
      onClick={trigger}
      title="Click me!"
    >
      {type === 'bunny'    && <BunnySvg    active={active} />}
      {type === 'bird'     && <BirdSvg     active={active} />}
      {type === 'deer'     && <DeerSvg     active={active} />}
      {type === 'owl'      && <OwlSvg      active={active} />}
      {type === 'fox'      && <FoxSvg      active={active} />}
      {type === 'squirrel' && <SquirrelSvg active={active} />}
    </div>
  )
})

export default TreeAnimalSprite

// ─── Bunny (full body) ────────────────────────────────────────────────────────
function BunnySvg({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 94" width="100%" height="auto">
      <defs>
        <radialGradient id="b-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fdf2f8"/><stop offset="100%" stopColor="#f9d4e8"/></radialGradient>
        <radialGradient id="b-blush" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fda4af" stopOpacity="0.6"/><stop offset="100%" stopColor="#fda4af" stopOpacity="0"/></radialGradient>
        <radialGradient id="b-nose" cx="40%" cy="35%" r="55%"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#f472b6"/></radialGradient>
      </defs>
      {/* Left ear — wiggles during hop */}
      <g style={active ? { transformOrigin: '22px 36px', animation: 'ear-wiggle 0.8s ease-in-out' } : undefined}>
        <ellipse cx="22" cy="20" rx="8" ry="16" fill="url(#b-body)"/>
        <ellipse cx="22" cy="20" rx="4.5" ry="10" fill="#fbcfe8" opacity="0.8"/>
      </g>
      {/* Right ear — wiggles with slight delay */}
      <g style={active ? { transformOrigin: '42px 36px', animation: 'ear-wiggle 0.8s ease-in-out 0.12s' } : undefined}>
        <ellipse cx="42" cy="20" rx="8" ry="16" fill="url(#b-body)"/>
        <ellipse cx="42" cy="20" rx="4.5" ry="10" fill="#fbcfe8" opacity="0.8"/>
      </g>
      {/* Head */}
      <circle cx="32" cy="42" r="20" fill="url(#b-body)"/>
      <circle cx="32" cy="38" r="12" fill="white" opacity="0.12"/>
      {/* Eyes */}
      <circle cx="24" cy="39" r="4.5" fill="#1f2937"/>
      <circle cx="40" cy="39" r="4.5" fill="#1f2937"/>
      <ellipse cx="25.8" cy="37.2" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="41.8" cy="37.2" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <circle cx="23" cy="40.5" r="0.6" fill="white" opacity="0.4"/>
      <circle cx="39" cy="40.5" r="0.6" fill="white" opacity="0.4"/>
      {/* Nose — twitches */}
      <g style={active ? { transformOrigin: '32px 46px', animation: 'nose-twitch 0.5s ease-in-out 0.3s' } : undefined}>
        <ellipse cx="32" cy="46" rx="3.5" ry="2.5" fill="url(#b-nose)"/>
      </g>
      {/* Mouth */}
      <path d="M29 49 Q32 53 35 49" stroke="#e879a8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 49 L32 51" stroke="#e879a8" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Blush */}
      <circle cx="20" cy="46" r="6" fill="url(#b-blush)"/>
      <circle cx="44" cy="46" r="6" fill="url(#b-blush)"/>
      {/* Body */}
      <ellipse cx="32" cy="73" rx="17" ry="14" fill="url(#b-body)"/>
      <ellipse cx="32" cy="70" rx="10" ry="8" fill="white" opacity="0.15"/>
      {/* Tail */}
      <circle cx="49" cy="66" r="8" fill="white"/>
      <circle cx="49" cy="66" r="5" fill="#fef9fb"/>
      {/* Feet */}
      <ellipse cx="19" cy="86" rx="11" ry="6" fill="url(#b-body)"/>
      <ellipse cx="45" cy="86" rx="11" ry="6" fill="url(#b-body)"/>
      <path d="M11 84 Q11 88 13 88" stroke="#f9a8d4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M19 86 Q19 91 21 91" stroke="#f9a8d4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M26 84 Q27 88 29 87" stroke="#f9a8d4" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Bird (full body) ─────────────────────────────────────────────────────────
function BirdSvg({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 72" width="100%" height="auto">
      <defs>
        <radialGradient id="bi-body" cx="45%" cy="35%" r="65%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#38bdf8"/></radialGradient>
        <radialGradient id="bi-head" cx="55%" cy="40%" r="55%"><stop offset="0%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0ea5e9"/></radialGradient>
        <linearGradient id="bi-wing" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0284c7"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient>
        <linearGradient id="bi-beak" x1="0%" y1="0%" x2="100%" y2="50%"><stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
      </defs>
      <path d="M14 46 Q6 38 10 30 Q16 40 22 48 Z" fill="#0369a1"/>
      <ellipse cx="30" cy="46" rx="18" ry="14" fill="url(#bi-body)"/>
      <ellipse cx="32" cy="43" rx="10" ry="7" fill="white" opacity="0.12"/>
      {/* Wing — flaps during flight */}
      <g style={active ? { transformOrigin: '30px 42px', animation: 'wing-flap 0.35s ease-in-out 4' } : undefined}>
        <path d="M14 42 Q22 32 34 38 Q28 50 14 50 Z" fill="url(#bi-wing)"/>
        <path d="M16 43 Q22 36 30 40" stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.5"/>
        <path d="M16 47 Q22 40 30 44" stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.5"/>
      </g>
      <circle cx="42" cy="28" r="14" fill="url(#bi-head)"/>
      <circle cx="44" cy="24" r="7" fill="white" opacity="0.1"/>
      <path d="M54 26 L63 30 L54 34 Z" fill="url(#bi-beak)"/>
      <circle cx="48" cy="24" r="5.5" fill="white"/>
      <circle cx="48" cy="24" r="3.8" fill="#1f2937"/>
      <ellipse cx="49.5" cy="22.5" rx="1.4" ry="1.1" fill="white" opacity="0.9"/>
      <circle cx="40" cy="30" r="3" fill="#f0abfc" opacity="0.2"/>
      <line x1="28" y1="58" x2="27" y2="66" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="58" x2="37" y2="66" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="27" y1="66" x2="22" y2="70" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27" y1="66" x2="27" y2="71" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27" y1="66" x2="32" y2="70" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="37" y1="66" x2="32" y2="70" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="37" y1="66" x2="37" y2="71" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="37" y1="66" x2="42" y2="70" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Deer (full body — reworked proportions) ──────────────────────────────────
function DeerSvg({ active: _active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 96" width="100%" height="auto">
      <defs>
        <radialGradient id="d-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fff1e0"/><stop offset="100%" stopColor="#fdba74"/></radialGradient>
        <radialGradient id="d-snout" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fde2c4"/><stop offset="100%" stopColor="#f97316" stopOpacity="0.3"/></radialGradient>
        <linearGradient id="d-antler" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#92400e"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
      </defs>
      {/* Antlers */}
      <path d="M24 16 Q21 10 18 7" stroke="url(#d-antler)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M21 11 Q18 9 16 5" stroke="url(#d-antler)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M40 16 Q43 10 46 7" stroke="url(#d-antler)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M43 11 Q46 9 48 5" stroke="url(#d-antler)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="7" r="1.3" fill="#b45309"/><circle cx="16" cy="5" r="1.2" fill="#b45309"/>
      <circle cx="46" cy="7" r="1.3" fill="#b45309"/><circle cx="48" cy="5" r="1.2" fill="#b45309"/>
      {/* Ears */}
      <ellipse cx="19" cy="22" rx="6.5" ry="9" fill="url(#d-body)"/>
      <ellipse cx="19" cy="22" rx="3.8" ry="5.5" fill="#fda4af" opacity="0.6"/>
      <ellipse cx="45" cy="22" rx="6.5" ry="9" fill="url(#d-body)"/>
      <ellipse cx="45" cy="22" rx="3.8" ry="5.5" fill="#fda4af" opacity="0.6"/>
      {/* Head */}
      <ellipse cx="32" cy="30" rx="14.5" ry="16" fill="url(#d-body)"/>
      <ellipse cx="32" cy="27" rx="9" ry="8" fill="white" opacity="0.1"/>
      {/* Eyes */}
      <circle cx="25" cy="27" r="4.8" fill="#1f2937"/>
      <circle cx="39" cy="27" r="4.8" fill="#1f2937"/>
      <ellipse cx="26.6" cy="25.4" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="40.6" cy="25.4" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      {/* Eyelashes */}
      <path d="M22 23 L20 20.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M24 22 L23 19.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M27 22 L27 19.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M37 22 L37 19.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M39 22 L40 19.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M42 23 L44 20.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      {/* Snout */}
      <ellipse cx="32" cy="36" rx="7" ry="5" fill="url(#d-snout)"/>
      <ellipse cx="29.5" cy="37" rx="1.5" ry="1.2" fill="#c2410c" opacity="0.4"/>
      <ellipse cx="34.5" cy="37" rx="1.5" ry="1.2" fill="#c2410c" opacity="0.4"/>
      <path d="M30 39 Q32 41.5 34 39" stroke="#c2410c" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Blush */}
      <circle cx="20" cy="31" r="3.5" fill="#fda4af" opacity="0.18"/>
      <circle cx="44" cy="31" r="3.5" fill="#fda4af" opacity="0.18"/>
      {/* Neck */}
      <ellipse cx="32" cy="46" rx="10" ry="7" fill="url(#d-body)"/>
      {/* Body */}
      <ellipse cx="32" cy="58" rx="17" ry="14" fill="url(#d-body)"/>
      <ellipse cx="32" cy="55" rx="10" ry="7" fill="white" opacity="0.12"/>
      {/* Spots */}
      <circle cx="28" cy="53" r="2.5" fill="white" opacity="0.45"/>
      <circle cx="37" cy="58" r="2.2" fill="white" opacity="0.4"/>
      <circle cx="24" cy="59" r="1.8" fill="white" opacity="0.35"/>
      <circle cx="40" cy="53" r="1.5" fill="white" opacity="0.3"/>
      {/* Legs */}
      <path d="M22 69 Q21 76 20 84" stroke="#f0be7a" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M28 70 Q27.5 77 27 84" stroke="#f0be7a" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M36 70 Q36.5 77 37 84" stroke="#f0be7a" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M42 69 Q43 76 44 84" stroke="#f0be7a" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Hooves */}
      <ellipse cx="20" cy="85" rx="4" ry="2.8" fill="#7c2d12"/>
      <ellipse cx="27" cy="85" rx="4" ry="2.8" fill="#7c2d12"/>
      <ellipse cx="37" cy="85" rx="4" ry="2.8" fill="#7c2d12"/>
      <ellipse cx="44" cy="85" rx="4" ry="2.8" fill="#7c2d12"/>
      {/* Tail */}
      <ellipse cx="48" cy="52" rx="3" ry="2.5" fill="url(#d-body)"/>
      <ellipse cx="48" cy="51" rx="1.8" ry="1.3" fill="white" opacity="0.4"/>
    </svg>
  )
}

// ─── Owl (full body) ──────────────────────────────────────────────────────────
function OwlSvg({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 74" width="100%" height="auto">
      <defs>
        <radialGradient id="o-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#a78bfa"/></radialGradient>
        <radialGradient id="o-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#8b5cf6"/></radialGradient>
        <radialGradient id="o-iris" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
        <radialGradient id="o-face" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#f5f3ff"/><stop offset="100%" stopColor="#e9e5fa"/></radialGradient>
      </defs>
      <ellipse cx="32" cy="50" rx="22" ry="18" fill="url(#o-body)"/>
      <path d="M14 48 Q20 42 28 46" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M14 54 Q20 48 28 52" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M50 48 Q44 42 36 46" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M50 54 Q44 48 36 52" stroke="#8b5cf6" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <ellipse cx="32" cy="52" rx="12" ry="10" fill="#ede9fe" opacity="0.4"/>
      <circle cx="32" cy="28" r="20" fill="url(#o-head)"/>
      <circle cx="32" cy="24" r="10" fill="white" opacity="0.08"/>
      <path d="M20 14 Q18 4 22 2 Q24 8 26 14 Z" fill="#6d28d9"/>
      <path d="M44 14 Q46 4 42 2 Q40 8 38 14 Z" fill="#6d28d9"/>
      <ellipse cx="32" cy="32" rx="16" ry="13" fill="url(#o-face)"/>
      {/* Eyes — blink during hoot */}
      <g style={active ? { transformOrigin: '32px 30px', animation: 'owl-blink 1.2s ease-in-out' } : undefined}>
        <circle cx="25" cy="30" r="7.5" fill="white"/>
        <circle cx="39" cy="30" r="7.5" fill="white"/>
        <circle cx="25" cy="30" r="5.5" fill="url(#o-iris)"/>
        <circle cx="39" cy="30" r="5.5" fill="url(#o-iris)"/>
        <circle cx="25" cy="30" r="3.5" fill="#1f2937"/>
        <circle cx="39" cy="30" r="3.5" fill="#1f2937"/>
        <ellipse cx="26.8" cy="28.3" rx="1.5" ry="1.2" fill="white" opacity="0.9"/>
        <ellipse cx="40.8" cy="28.3" rx="1.5" ry="1.2" fill="white" opacity="0.9"/>
      </g>
      <path d="M28 37 L32 42 L36 37 Z" fill="#f59e0b"/>
      <path d="M24 66 L20 62 M24 66 L24 60 M24 66 L28 62" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M40 66 L36 62 M40 66 L40 60 M40 66 L44 62" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Fox (full body) ──────────────────────────────────────────────────────────
function FoxSvg({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 100" width="100%" height="auto">
      <defs>
        <radialGradient id="f-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#ea580c"/></radialGradient>
        <radialGradient id="f-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#f97316"/></radialGradient>
        <radialGradient id="f-muzzle" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="#fff7ed"/></radialGradient>
        <radialGradient id="f-nose" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#374151"/><stop offset="100%" stopColor="#111827"/></radialGradient>
      </defs>
      <ellipse cx="32" cy="56" rx="18" ry="14" fill="url(#f-body)"/>
      <ellipse cx="32" cy="53" rx="10" ry="7" fill="white" opacity="0.1"/>
      {/* Tail — wags during bounce */}
      <g style={active ? { transformOrigin: '46px 58px', animation: 'tail-wag 0.95s ease-in-out' } : undefined}>
        <path d="M48 54 Q60 46 62 56 Q62 68 52 66 Q46 64 44 56 Z" fill="#fb923c"/>
        <path d="M54 62 Q60 66 58 72 Q52 68 50 64 Z" fill="white"/>
      </g>
      <path d="M18 20 L14 4 L28 14 Z" fill="#f97316"/>
      <path d="M19 19 L16 8 L27 15 Z" fill="#fda4af" opacity="0.7"/>
      <path d="M46 20 L50 4 L36 14 Z" fill="#f97316"/>
      <path d="M45 19 L48 8 L37 15 Z" fill="#fda4af" opacity="0.7"/>
      <circle cx="32" cy="30" r="20" fill="url(#f-head)"/>
      <circle cx="32" cy="26" r="10" fill="white" opacity="0.08"/>
      <ellipse cx="32" cy="20" rx="5.5" ry="4.5" fill="white" opacity="0.4"/>
      <ellipse cx="32" cy="38" rx="12" ry="10" fill="url(#f-muzzle)"/>
      <circle cx="24" cy="28" r="5.2" fill="#1f2937"/>
      <circle cx="40" cy="28" r="5.2" fill="#1f2937"/>
      <ellipse cx="25.8" cy="26.2" rx="2" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="41.8" cy="26.2" rx="2" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="32" cy="38" rx="4.5" ry="3" fill="url(#f-nose)"/>
      <path d="M28 42 Q32 46 36 42" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="20" cy="37" r="1.2" fill="#d4d4d8"/>
      <circle cx="22" cy="41" r="1.2" fill="#d4d4d8"/>
      <circle cx="44" cy="37" r="1.2" fill="#d4d4d8"/>
      <circle cx="42" cy="41" r="1.2" fill="#d4d4d8"/>
      <path d="M22 68 Q21 77 20 88" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M28 70 Q27 79 26 88" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M36 70 Q37 79 38 88" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M42 68 Q43 77 44 88" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <ellipse cx="20" cy="89" rx="5.5" ry="4" fill="#ea580c"/>
      <ellipse cx="26" cy="89" rx="5.5" ry="4" fill="#ea580c"/>
      <ellipse cx="38" cy="89" rx="5.5" ry="4" fill="#ea580c"/>
      <ellipse cx="44" cy="89" rx="5.5" ry="4" fill="#ea580c"/>
    </svg>
  )
}

// ─── Squirrel (full body) ─────────────────────────────────────────────────────
function SquirrelSvg({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 90" width="100%" height="auto">
      <defs>
        <radialGradient id="sq-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#d4a574"/><stop offset="100%" stopColor="#a0714a"/></radialGradient>
        <radialGradient id="sq-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c9956a"/><stop offset="100%" stopColor="#8b6340"/></radialGradient>
        <radialGradient id="sq-belly" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fef3e2"/><stop offset="100%" stopColor="#fde2b8"/></radialGradient>
        <radialGradient id="sq-tail" cx="30%" cy="50%" r="65%"><stop offset="0%" stopColor="#c9956a"/><stop offset="100%" stopColor="#7a5030"/></radialGradient>
        <radialGradient id="sq-nose" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#4b3621"/><stop offset="100%" stopColor="#2c1f12"/></radialGradient>
      </defs>
      {/* Tail — poofs during scurry */}
      <g style={active ? { transformOrigin: '44px 38px', animation: 'tail-poof 1.8s ease-in-out' } : undefined}>
        <path d="M44 52 Q56 42 58 28 Q60 16 52 12 Q44 8 40 16 Q36 24 42 32 Q46 38 44 46 Z" fill="url(#sq-tail)"/>
        <path d="M48 44 Q54 36 54 26" stroke="#a0714a" strokeWidth="1" fill="none" opacity="0.4"/>
        <ellipse cx="52" cy="14" rx="4" ry="3" fill="#d4a574" opacity="0.4"/>
      </g>
      {/* Body */}
      <ellipse cx="30" cy="56" rx="15" ry="13" fill="url(#sq-body)"/>
      <ellipse cx="30" cy="58" rx="9" ry="8" fill="url(#sq-belly)"/>
      {/* Back legs */}
      <ellipse cx="20" cy="68" rx="8" ry="5.5" fill="url(#sq-body)"/>
      <ellipse cx="38" cy="68" rx="7" ry="5" fill="url(#sq-body)"/>
      <ellipse cx="16" cy="72" rx="5" ry="3" fill="#8b6340"/>
      <ellipse cx="36" cy="72" rx="4.5" ry="2.8" fill="#8b6340"/>
      {/* Front paws — scrabble during scurry */}
      <g style={active ? { transformOrigin: '22px 64px', animation: 'paw-scrabble 0.45s ease-in-out 4' } : undefined}>
        <path d="M24 56 Q22 62 20 66" stroke="#a0714a" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <ellipse cx="20" cy="67" rx="3.5" ry="2.5" fill="#8b6340"/>
      </g>
      <g style={active ? { transformOrigin: '34px 64px', animation: 'paw-scrabble 0.45s ease-in-out 0.11s 4' } : undefined}>
        <path d="M32 56 Q33 62 34 66" stroke="#a0714a" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <ellipse cx="34" cy="67" rx="3.5" ry="2.5" fill="#8b6340"/>
      </g>
      {/* Ears */}
      <ellipse cx="20" cy="26" rx="5.5" ry="7" fill="url(#sq-head)"/>
      <ellipse cx="20" cy="26" rx="3" ry="4.5" fill="#fda4af" opacity="0.5"/>
      <path d="M18 20 Q17 17 19 16 Q21 17 20 20" fill="#a0714a"/>
      <ellipse cx="38" cy="26" rx="5.5" ry="7" fill="url(#sq-head)"/>
      <ellipse cx="38" cy="26" rx="3" ry="4.5" fill="#fda4af" opacity="0.5"/>
      <path d="M36 20 Q35 17 37 16 Q39 17 38 20" fill="#a0714a"/>
      {/* Head */}
      <circle cx="29" cy="36" r="15" fill="url(#sq-head)"/>
      <circle cx="29" cy="33" r="8" fill="white" opacity="0.08"/>
      {/* Cheeks */}
      <ellipse cx="20" cy="40" rx="6" ry="5" fill="#c9956a"/>
      <ellipse cx="38" cy="40" rx="6" ry="5" fill="#c9956a"/>
      {/* Muzzle */}
      <ellipse cx="29" cy="42" rx="8" ry="6" fill="url(#sq-belly)" opacity="0.8"/>
      {/* Eyes */}
      <circle cx="23" cy="34" r="4.5" fill="#1f2937"/>
      <circle cx="35" cy="34" r="4.5" fill="#1f2937"/>
      <ellipse cx="24.5" cy="32.5" rx="1.6" ry="1.3" fill="white" opacity="0.9"/>
      <ellipse cx="36.5" cy="32.5" rx="1.6" ry="1.3" fill="white" opacity="0.9"/>
      {/* Nose */}
      <ellipse cx="29" cy="41" rx="3" ry="2" fill="url(#sq-nose)"/>
      {/* Mouth */}
      <path d="M26 43.5 Q29 46 32 43.5" stroke="#6b4c30" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* White stripe */}
      <ellipse cx="29" cy="30" rx="3" ry="4" fill="white" opacity="0.15"/>
    </svg>
  )
}
