import { ImageResponse } from 'next/og'

// 180×180 — the size iOS uses for home screen icons
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 88, lineHeight: 1 }}>🌱</span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-0.5px',
          textShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      >
        CoinSprout
      </span>
    </div>,
    { ...size }
  )
}
