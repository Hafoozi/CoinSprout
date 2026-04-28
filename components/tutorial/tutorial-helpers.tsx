import { type CSSProperties, type ReactNode } from 'react'

// ── Screenshot wrapper ────────────────────────────────────────────────────────
// -m-4 counteracts the p-4 on the overlay's mockup card, making the image
// bleed edge-to-edge while the parent's overflow-hidden clips the corners.

export function Shot({ src, children }: { src: string; children?: ReactNode }) {
  return (
    <div className="-m-4 relative overflow-hidden select-none">
      <img src={src} className="w-full block" alt="" draggable={false} />
      {children}
    </div>
  )
}

// ── Pulsing highlight ring ────────────────────────────────────────────────────

export function Highlight({ style }: { style: CSSProperties }) {
  return (
    <div
      className="absolute tutorial-hl pointer-events-none z-10"
      style={style}
    />
  )
}

// ── Speech-bubble callout ─────────────────────────────────────────────────────
// tail='up'   → triangle at top,    callout sits BELOW the highlight
// tail='down' → triangle at bottom, callout sits ABOVE the highlight
// tail='none' → no triangle

const UP_TAIL: CSSProperties = {
  width: 0, height: 0, marginLeft: 12, marginBottom: -1,
  borderLeft: '7px solid transparent',
  borderRight: '7px solid transparent',
  borderBottom: '8px solid white',
}

const DOWN_TAIL: CSSProperties = {
  width: 0, height: 0, marginLeft: 12, marginTop: -1,
  borderLeft: '7px solid transparent',
  borderRight: '7px solid transparent',
  borderTop: '8px solid white',
}

export function Callout({
  text,
  style,
  tail = 'up',
}: {
  text:  string
  style: CSSProperties
  tail?: 'up' | 'down' | 'none'
}) {
  return (
    <div className="absolute z-20 pointer-events-none tutorial-callout" style={style}>
      {/* drop-shadow wraps triangle + card as one unified shape */}
      <div style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))' }}>
        {tail === 'up'   && <div style={UP_TAIL}   />}
        <div className="bg-white rounded-xl px-3 py-1.5 whitespace-nowrap">
          <p className="text-xs font-bold text-gray-800 leading-tight">{text}</p>
        </div>
        {tail === 'down' && <div style={DOWN_TAIL} />}
      </div>
    </div>
  )
}
