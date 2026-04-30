import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'CoinSprout – Grow your savings, one coin at a time.'
export const size        = { width: 1200, height: 630 }
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
        <div style={{ position: 'absolute', top: -120, right: -120, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -90, left: -90, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 60, left: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex' }} />

        {/* Logo */}
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <svg width="160" height="160" viewBox="125 128 305 305" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#16A34A"/>
                <stop offset="100%" stopColor="#0F7A3B"/>
              </linearGradient>
              <radialGradient id="coinGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FDE047"/>
                <stop offset="100%" stopColor="#EAB308"/>
              </radialGradient>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#86EFAC"/>
                <stop offset="100%" stopColor="#22C55E"/>
              </linearGradient>
            </defs>
            <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>
            <circle cx="235" cy="320" r="90" fill="url(#coinGrad)"/>
            <circle cx="235" cy="320" r="70" fill="none" stroke="#CA8A04" strokeWidth="10"/>
            <path d="M235 260 C240 235, 270 210, 320 175" stroke="#14532D" strokeWidth="16" strokeLinecap="round" fill="none"/>
            <path d="M270 190 C240 175, 210 185, 210 215 C245 220, 260 205, 270 190 Z" fill="url(#leafGrad)"/>
            <path d="M320 175 C370 150, 410 170, 410 215 C360 225, 330 205, 320 175 Z" fill="url(#leafGrad)"/>
          </svg>
        </div>

        {/* App name */}
        <div style={{ fontSize: 92, fontWeight: 900, color: 'white', letterSpacing: '-3px', display: 'flex' }}>
          CoinSprout
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 52, color: 'rgba(255,255,255,0.78)', marginTop: 20, fontWeight: 400, display: 'flex' }}>
          Watch savings grow
        </div>
      </div>
    ),
    { ...size }
  )
}
