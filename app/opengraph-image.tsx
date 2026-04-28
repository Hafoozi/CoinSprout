import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CoinSprout – Grow your savings, one coin at a time.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #166534 45%, #16a34a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background circles */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -90,
            left: -90,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 80,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
          }}
        />

        {/* Sprout icon */}
        <div style={{ fontSize: 104, marginBottom: 20, display: 'flex' }}>🌱</div>

        {/* App name */}
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-3px',
            display: 'flex',
          }}
        >
          CoinSprout
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.78)',
            marginTop: 20,
            fontWeight: 400,
            display: 'flex',
          }}
        >
          Watch savings grow
        </div>

        {/* Bottom coin row */}
        <div style={{ display: 'flex', marginTop: 52, gap: 20 }}>
          <div style={{ fontSize: 44, display: 'flex' }}>🪙</div>
          <div style={{ fontSize: 44, display: 'flex' }}>🌿</div>
          <div style={{ fontSize: 44, display: 'flex' }}>🪙</div>
          <div style={{ fontSize: 44, display: 'flex' }}>🌿</div>
          <div style={{ fontSize: 44, display: 'flex' }}>🪙</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
