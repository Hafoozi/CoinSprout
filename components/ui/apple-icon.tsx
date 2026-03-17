import type { FruitColor } from '@/types/domain'
import { APPLE_HEX } from '@/lib/constants/fruit-colors'

interface Props {
  color: FruitColor
  size?: number
}

export default function AppleIcon({ color, size = 18 }: Props) {
  const fill        = APPLE_HEX[color]
  const isSparkling = color === 'sparkling'
  const height      = Math.round(size * 20 / 18)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 18 20"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Stem */}
      <path d="M9 3 Q9.5 0.5 11.5 2" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Leaf */}
      <path d="M9 3 Q13 0 14.5 3.5" stroke="#16a34a" strokeWidth="1.2" fill="#22c55e"/>
      {/* Body */}
      <circle cx="9" cy="12" r="7.5" fill={fill} stroke={isSparkling ? '#f59e0b' : 'none'} strokeWidth={isSparkling ? 1 : 0}/>
      {/* Top cleft */}
      <path d="M6 5.5 Q9 4.5 12 5.5" fill="none" stroke={isSparkling ? 'rgba(245,158,11,0.3)' : 'rgba(0,0,0,0.13)'} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Highlight */}
      {isSparkling
        ? <text x="9" y="16.5" textAnchor="middle" fontSize="11" fill="#f59e0b">★</text>
        : <circle cx="5.5" cy="9" r="2" fill="white" opacity="0.35"/>
      }
    </svg>
  )
}
