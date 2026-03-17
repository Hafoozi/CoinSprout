import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(145deg, #4ade80, #15803d)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '22%',
      }}
    >
      {/* Tree silhouette — white on green */}
      <svg viewBox="0 0 180 180" width="32" height="32">
        <rect x="0" y="148" width="180" height="32" fill="rgba(0,0,0,0.15)"/>
        <rect x="83" y="118" width="14" height="34" rx="4" fill="rgba(0,0,0,0.35)"/>
        <ellipse cx="90" cy="92"  rx="52" ry="48" fill="white" opacity="0.95"/>
        <ellipse cx="68" cy="100" rx="32" ry="30" fill="white" opacity="0.7"/>
        <ellipse cx="112" cy="98" rx="30" ry="28" fill="white" opacity="0.7"/>
        <ellipse cx="90" cy="72"  rx="34" ry="30" fill="white" opacity="0.8"/>
        <circle cx="82"  cy="84"  r="5" fill="#fbbf24"/>
        <circle cx="98"  cy="80"  r="5" fill="#fbbf24"/>
        <circle cx="74"  cy="98"  r="4" fill="#fbbf24"/>
        <circle cx="106" cy="96"  r="4" fill="#fbbf24"/>
      </svg>
    </div>,
    { ...size }
  )
}
