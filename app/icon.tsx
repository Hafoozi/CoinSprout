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
      <span style={{ fontSize: 20, lineHeight: 1 }}>🌱</span>
    </div>,
    { ...size }
  )
}
