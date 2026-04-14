import type { SVGProps } from 'react'
import type { MilestoneType } from '@/types/database'

interface Props {
  type: MilestoneType
  size?: number
  muted?: boolean
}

export default function AnimalIcon({ type, size = 64, muted = false }: Props) {
  const style = muted ? { filter: 'grayscale(1)', opacity: 0.35 } : undefined
  const props = { width: size, height: size, viewBox: '0 0 64 64', style }
  switch (type) {
    case 'bunny':    return <Bunny {...props} />
    case 'bird':     return <Bird  {...props} />
    case 'deer':     return <Deer  {...props} />
    case 'owl':      return <Owl   {...props} />
    case 'fox':      return <Fox   {...props} />
    case 'squirrel': return <Squirrel {...props} />
    default:         return null
  }
}

// ─── Bunny ────────────────────────────────────────────────────────────────────
function Bunny(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="bunny-icon-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fdf2f8"/><stop offset="100%" stopColor="#f9d4e8"/></radialGradient>
        <radialGradient id="bunny-icon-blush" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fda4af" stopOpacity="0.6"/><stop offset="100%" stopColor="#fda4af" stopOpacity="0"/></radialGradient>
        <radialGradient id="bunny-icon-nose" cx="40%" cy="35%" r="55%"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#f472b6"/></radialGradient>
      </defs>
      {/* Left ear */}
      <ellipse cx="22" cy="20" rx="8" ry="16" fill="url(#bunny-icon-body)"/>
      <ellipse cx="22" cy="20" rx="4.5" ry="10" fill="#fbcfe8" opacity="0.8"/>
      {/* Right ear */}
      <ellipse cx="42" cy="20" rx="8" ry="16" fill="url(#bunny-icon-body)"/>
      <ellipse cx="42" cy="20" rx="4.5" ry="10" fill="#fbcfe8" opacity="0.8"/>
      {/* Head */}
      <circle cx="32" cy="42" r="20" fill="url(#bunny-icon-body)"/>
      <circle cx="32" cy="38" r="12" fill="white" opacity="0.12"/>
      {/* Eyes */}
      <circle cx="24" cy="39" r="4.5" fill="#1f2937"/>
      <circle cx="40" cy="39" r="4.5" fill="#1f2937"/>
      <ellipse cx="25.8" cy="37.2" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="41.8" cy="37.2" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <circle cx="23" cy="40.5" r="0.6" fill="white" opacity="0.4"/>
      <circle cx="39" cy="40.5" r="0.6" fill="white" opacity="0.4"/>
      {/* Nose */}
      <ellipse cx="32" cy="46" rx="3.5" ry="2.5" fill="url(#bunny-icon-nose)"/>
      {/* Mouth */}
      <path d="M29 49 Q32 53 35 49" stroke="#e879a8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M32 49 L32 51" stroke="#e879a8" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Blush */}
      <circle cx="20" cy="46" r="6" fill="url(#bunny-icon-blush)"/>
      <circle cx="44" cy="46" r="6" fill="url(#bunny-icon-blush)"/>
    </svg>
  )
}

// ─── Bird ─────────────────────────────────────────────────────────────────────
function Bird(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="bird-icon-body" cx="45%" cy="35%" r="65%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#38bdf8"/></radialGradient>
        <radialGradient id="bird-icon-head" cx="55%" cy="40%" r="55%"><stop offset="0%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0ea5e9"/></radialGradient>
        <linearGradient id="bird-icon-wing" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0284c7"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient>
        <linearGradient id="bird-icon-beak" x1="0%" y1="0%" x2="100%" y2="50%"><stop offset="0%" stopColor="#fcd34d"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
      </defs>
      {/* Body */}
      <ellipse cx="30" cy="46" rx="18" ry="14" fill="url(#bird-icon-body)"/>
      <ellipse cx="32" cy="43" rx="10" ry="7" fill="white" opacity="0.12"/>
      {/* Head */}
      <circle cx="42" cy="28" r="14" fill="url(#bird-icon-head)"/>
      <circle cx="44" cy="24" r="7" fill="white" opacity="0.1"/>
      {/* Beak */}
      <path d="M54 26 L62 30 L54 34 Z" fill="url(#bird-icon-beak)"/>
      {/* Eye */}
      <circle cx="48" cy="24" r="5.5" fill="white"/>
      <circle cx="48" cy="24" r="3.8" fill="#1f2937"/>
      <ellipse cx="49.5" cy="22.5" rx="1.4" ry="1.1" fill="white" opacity="0.9"/>
      {/* Wing */}
      <path d="M14 42 Q22 32 34 38 Q28 50 14 50 Z" fill="url(#bird-icon-wing)"/>
      {/* Cheek */}
      <circle cx="40" cy="30" r="3" fill="#f0abfc" opacity="0.2"/>
      {/* Tail */}
      <path d="M14 46 Q6 38 10 30 Q16 40 22 48 Z" fill="#0369a1"/>
      {/* Feet */}
      <line x1="28" y1="58" x2="24" y2="63" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="28" y1="58" x2="28" y2="64" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="28" y1="58" x2="32" y2="63" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="36" y2="63" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="40" y2="64" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="44" y2="63" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Deer ─────────────────────────────────────────────────────────────────────
function Deer(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="deer-icon-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fff1e0"/><stop offset="100%" stopColor="#fdba74"/></radialGradient>
        <radialGradient id="deer-icon-snout" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fde2c4"/><stop offset="100%" stopColor="#f97316" stopOpacity="0.3"/></radialGradient>
        <linearGradient id="deer-icon-antler" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#92400e"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
      </defs>
      {/* Antlers */}
      <path d="M24 16 Q21 10 18 7" stroke="url(#deer-icon-antler)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M21 11 Q18 9 16 5" stroke="url(#deer-icon-antler)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M40 16 Q43 10 46 7" stroke="url(#deer-icon-antler)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M43 11 Q46 9 48 5" stroke="url(#deer-icon-antler)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="7" r="1.3" fill="#b45309"/><circle cx="16" cy="5" r="1.2" fill="#b45309"/>
      <circle cx="46" cy="7" r="1.3" fill="#b45309"/><circle cx="48" cy="5" r="1.2" fill="#b45309"/>
      {/* Ears */}
      <ellipse cx="19" cy="22" rx="6.5" ry="9" fill="url(#deer-icon-body)"/>
      <ellipse cx="19" cy="22" rx="3.8" ry="5.5" fill="#fda4af" opacity="0.6"/>
      <ellipse cx="45" cy="22" rx="6.5" ry="9" fill="url(#deer-icon-body)"/>
      <ellipse cx="45" cy="22" rx="3.8" ry="5.5" fill="#fda4af" opacity="0.6"/>
      {/* Head */}
      <ellipse cx="32" cy="34" rx="14.5" ry="16" fill="url(#deer-icon-body)"/>
      <ellipse cx="32" cy="30" rx="9" ry="8" fill="white" opacity="0.1"/>
      {/* Eyes */}
      <circle cx="25" cy="30" r="4.8" fill="#1f2937"/>
      <circle cx="39" cy="30" r="4.8" fill="#1f2937"/>
      <ellipse cx="26.6" cy="28.4" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="40.6" cy="28.4" rx="1.8" ry="1.5" fill="white" opacity="0.9"/>
      {/* Eyelashes */}
      <path d="M22 26 L20 23.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M24 25 L23 22.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M27 25 L27 22.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M37 25 L37 22.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M39 25 L40 22.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M42 26 L44 23.5" stroke="#1f2937" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      {/* Snout */}
      <ellipse cx="32" cy="40" rx="7" ry="5" fill="url(#deer-icon-snout)"/>
      <ellipse cx="29.5" cy="41" rx="1.5" ry="1.2" fill="#c2410c" opacity="0.4"/>
      <ellipse cx="34.5" cy="41" rx="1.5" ry="1.2" fill="#c2410c" opacity="0.4"/>
      {/* Mouth */}
      <path d="M30 43 Q32 45.5 34 43" stroke="#c2410c" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Blush */}
      <circle cx="20" cy="34" r="3.5" fill="#fda4af" opacity="0.18"/>
      <circle cx="44" cy="34" r="3.5" fill="#fda4af" opacity="0.18"/>
      {/* Body hint */}
      <ellipse cx="32" cy="58" rx="16" ry="8" fill="url(#deer-icon-body)"/>
      {/* Spots */}
      <circle cx="28" cy="55" r="2" fill="white" opacity="0.4"/>
      <circle cx="37" cy="58" r="1.8" fill="white" opacity="0.35"/>
    </svg>
  )
}

// ─── Owl ──────────────────────────────────────────────────────────────────────
function Owl(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="owl-icon-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#a78bfa"/></radialGradient>
        <radialGradient id="owl-icon-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#8b5cf6"/></radialGradient>
        <radialGradient id="owl-icon-iris" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
        <radialGradient id="owl-icon-face" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#f5f3ff"/><stop offset="100%" stopColor="#e9e5fa"/></radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="32" cy="50" rx="22" ry="18" fill="url(#owl-icon-body)"/>
      <ellipse cx="32" cy="52" rx="12" ry="10" fill="#ede9fe" opacity="0.4"/>
      {/* Head */}
      <circle cx="32" cy="28" r="20" fill="url(#owl-icon-head)"/>
      <circle cx="32" cy="24" r="10" fill="white" opacity="0.08"/>
      {/* Ear tufts */}
      <path d="M20 14 Q18 4 22 2 Q24 8 26 14 Z" fill="#6d28d9"/>
      <path d="M44 14 Q46 4 42 2 Q40 8 38 14 Z" fill="#6d28d9"/>
      {/* Face disk */}
      <ellipse cx="32" cy="32" rx="16" ry="13" fill="url(#owl-icon-face)"/>
      {/* Eyes */}
      <circle cx="25" cy="30" r="7.5" fill="white"/>
      <circle cx="39" cy="30" r="7.5" fill="white"/>
      <circle cx="25" cy="30" r="5.5" fill="url(#owl-icon-iris)"/>
      <circle cx="39" cy="30" r="5.5" fill="url(#owl-icon-iris)"/>
      <circle cx="25" cy="30" r="3.5" fill="#1f2937"/>
      <circle cx="39" cy="30" r="3.5" fill="#1f2937"/>
      <ellipse cx="26.8" cy="28.3" rx="1.5" ry="1.2" fill="white" opacity="0.9"/>
      <ellipse cx="40.8" cy="28.3" rx="1.5" ry="1.2" fill="white" opacity="0.9"/>
      {/* Beak */}
      <path d="M28 37 L32 42 L36 37 Z" fill="#f59e0b"/>
      {/* Claws */}
      <path d="M24 64 L20 60 M24 64 L24 58 M24 64 L28 60" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M40 64 L36 60 M40 64 L40 58 M40 64 L44 60" stroke="#6d28d9" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Fox ──────────────────────────────────────────────────────────────────────
function Fox(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="fox-icon-body" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#ea580c"/></radialGradient>
        <radialGradient id="fox-icon-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#f97316"/></radialGradient>
        <radialGradient id="fox-icon-muzzle" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="#fff7ed"/></radialGradient>
        <radialGradient id="fox-icon-nose" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#374151"/><stop offset="100%" stopColor="#111827"/></radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="32" cy="52" rx="18" ry="13" fill="url(#fox-icon-body)"/>
      {/* Tail */}
      <path d="M48 50 Q60 44 62 54 Q62 64 52 62 Q46 60 44 54 Z" fill="#fb923c"/>
      <path d="M54 60 Q60 64 58 70 Q52 66 50 62 Z" fill="white"/>
      {/* Ears */}
      <path d="M18 20 L14 4  L28 14 Z" fill="#f97316"/>
      <path d="M19 19 L16 8  L27 15 Z" fill="#fda4af" opacity="0.7"/>
      <path d="M46 20 L50 4  L36 14 Z" fill="#f97316"/>
      <path d="M45 19 L48 8  L37 15 Z" fill="#fda4af" opacity="0.7"/>
      {/* Head */}
      <circle cx="32" cy="30" r="20" fill="url(#fox-icon-head)"/>
      <circle cx="32" cy="26" r="10" fill="white" opacity="0.08"/>
      {/* Forehead stripe */}
      <ellipse cx="32" cy="20" rx="5.5" ry="4.5" fill="white" opacity="0.4"/>
      {/* Muzzle */}
      <ellipse cx="32" cy="38" rx="12" ry="10" fill="url(#fox-icon-muzzle)"/>
      {/* Eyes */}
      <circle cx="24" cy="28" r="5.2" fill="#1f2937"/>
      <circle cx="40" cy="28" r="5.2" fill="#1f2937"/>
      <ellipse cx="25.8" cy="26.2" rx="2" ry="1.5" fill="white" opacity="0.9"/>
      <ellipse cx="41.8" cy="26.2" rx="2" ry="1.5" fill="white" opacity="0.9"/>
      {/* Nose */}
      <ellipse cx="32" cy="38" rx="4.5" ry="3" fill="url(#fox-icon-nose)"/>
      {/* Mouth */}
      <path d="M28 42 Q32 46 36 42" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whisker dots */}
      <circle cx="20" cy="37" r="1.2" fill="#d4d4d8"/>
      <circle cx="22" cy="41" r="1.2" fill="#d4d4d8"/>
      <circle cx="44" cy="37" r="1.2" fill="#d4d4d8"/>
      <circle cx="42" cy="41" r="1.2" fill="#d4d4d8"/>
    </svg>
  )
}

// ─── Squirrel ─────────────────────────────────────────────────────────────────
function Squirrel(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...p}>
      <defs>
        <radialGradient id="sq-icon-head" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c9956a"/><stop offset="100%" stopColor="#8b6340"/></radialGradient>
        <radialGradient id="sq-icon-belly" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#fef3e2"/><stop offset="100%" stopColor="#fde2b8"/></radialGradient>
        <radialGradient id="sq-icon-tail" cx="30%" cy="50%" r="65%"><stop offset="0%" stopColor="#c9956a"/><stop offset="100%" stopColor="#7a5030"/></radialGradient>
        <radialGradient id="sq-icon-nose" cx="40%" cy="35%" r="50%"><stop offset="0%" stopColor="#4b3621"/><stop offset="100%" stopColor="#2c1f12"/></radialGradient>
      </defs>
      {/* Tail */}
      <path d="M42 44 Q54 34 54 22 Q54 12 48 10 Q42 8 40 14 Q38 20 42 28 Q44 34 42 40 Z" fill="url(#sq-icon-tail)"/>
      {/* Ears */}
      <ellipse cx="22" cy="20" rx="5" ry="6.5" fill="url(#sq-icon-head)"/>
      <ellipse cx="22" cy="20" rx="2.8" ry="4" fill="#fda4af" opacity="0.5"/>
      <ellipse cx="40" cy="20" rx="5" ry="6.5" fill="url(#sq-icon-head)"/>
      <ellipse cx="40" cy="20" rx="2.8" ry="4" fill="#fda4af" opacity="0.5"/>
      {/* Ear tufts */}
      <path d="M20 15 Q19 12 21 11 Q23 12 22 15" fill="#a0714a"/>
      <path d="M38 15 Q37 12 39 11 Q41 12 40 15" fill="#a0714a"/>
      {/* Head */}
      <circle cx="31" cy="32" r="16" fill="url(#sq-icon-head)"/>
      <circle cx="31" cy="29" r="8" fill="white" opacity="0.08"/>
      {/* Cheeks */}
      <ellipse cx="22" cy="36" rx="5.5" ry="4.5" fill="#c9956a"/>
      <ellipse cx="40" cy="36" rx="5.5" ry="4.5" fill="#c9956a"/>
      {/* Muzzle */}
      <ellipse cx="31" cy="40" rx="7.5" ry="5.5" fill="url(#sq-icon-belly)" opacity="0.8"/>
      {/* Eyes */}
      <circle cx="25" cy="30" r="4.5" fill="#1f2937"/>
      <circle cx="37" cy="30" r="4.5" fill="#1f2937"/>
      <ellipse cx="26.5" cy="28.5" rx="1.6" ry="1.3" fill="white" opacity="0.9"/>
      <ellipse cx="38.5" cy="28.5" rx="1.6" ry="1.3" fill="white" opacity="0.9"/>
      {/* Nose */}
      <ellipse cx="31" cy="39" rx="3" ry="2" fill="url(#sq-icon-nose)"/>
      {/* Mouth */}
      <path d="M28 41.5 Q31 44 34 41.5" stroke="#6b4c30" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Body hint */}
      <ellipse cx="31" cy="56" rx="14" ry="9" fill="url(#sq-icon-head)"/>
      <ellipse cx="31" cy="57" rx="8" ry="6" fill="url(#sq-icon-belly)"/>
    </svg>
  )
}
