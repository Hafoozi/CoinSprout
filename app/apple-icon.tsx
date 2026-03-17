import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(145deg, #4ade80, #15803d)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg viewBox="0 0 180 180" width="180" height="180">
        {/* Ground strip */}
        <rect x="0" y="152" width="180" height="28" fill="rgba(0,0,0,0.18)"/>
        {/* Trunk — wide and prominent */}
        <rect x="76" y="108" width="28" height="46" rx="6" fill="rgba(0,0,0,0.40)"/>
        {/* Canopy — simplified to 2 layers for clarity */}
        <ellipse cx="90" cy="88" rx="56" ry="52" fill="white" opacity="0.95"/>
        <ellipse cx="90" cy="68" rx="38" ry="34" fill="white" opacity="0.75"/>
        {/* Fruit — large and clearly visible */}
        <circle cx="72"  cy="78"  r="9" fill="#fbbf24"/>
        <circle cx="72"  cy="78"  r="5" fill="#f59e0b"/>
        <circle cx="108" cy="76"  r="9" fill="#fbbf24"/>
        <circle cx="108" cy="76"  r="5" fill="#f59e0b"/>
        <circle cx="90"  cy="100" r="9" fill="#fbbf24"/>
        <circle cx="90"  cy="100" r="5" fill="#f59e0b"/>
      </svg>
    </div>,
    { ...size }
  )
}
