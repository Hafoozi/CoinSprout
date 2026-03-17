import type { TreeStage } from '@/types/domain'

interface TreeSvgProps {
  stage: TreeStage
  className?: string
}

/**
 * Pure SVG tree that grows across 4 stages based on lifetime earnings.
 * sapling ($0) → young ($25) → growing ($100) → mature ($250)
 */
export default function TreeSvg({ stage, className = '' }: TreeSvgProps) {
  return (
    <svg
      viewBox="0 0 240 280"
      className={className}
      aria-label={`${stage} tree`}
      role="img"
    >
      {/* Ground shadow */}
      <ellipse cx="120" cy="268" rx="55" ry="10" fill="#86efac" opacity="0.5" />

      {stage === 'sapling' && <Sapling />}
      {stage === 'young'   && <Young />}
      {stage === 'growing' && <Growing />}
      {stage === 'mature'  && <Mature />}
    </svg>
  )
}

function Sapling() {
  return (
    <g>
      <rect x="117" y="200" width="6" height="68" rx="3" fill="#92400e" />
      <ellipse cx="104" cy="196" rx="16" ry="10" fill="#4ade80" transform="rotate(-30 104 196)" />
      <ellipse cx="136" cy="192" rx="16" ry="10" fill="#22c55e" transform="rotate(30 136 192)" />
      <ellipse cx="120" cy="186" rx="10" ry="13" fill="#16a34a" />
    </g>
  )
}

function Young() {
  return (
    <g>
      <path d="M110 268 Q108 230 112 200 L128 200 Q132 230 130 268 Z" fill="#92400e" />
      <circle cx="120" cy="155" r="62" fill="#86efac" />
      <circle cx="120" cy="145" r="52" fill="#4ade80" />
      <circle cx="120" cy="138" r="38" fill="#22c55e" />
      <circle cx="112" cy="118" r="18" fill="#16a34a" opacity="0.6" />
    </g>
  )
}

function Growing() {
  return (
    <g>
      <path d="M106 268 Q100 240 106 195 L134 195 Q140 240 134 268 Z" fill="#78350f" />
      <path d="M106 255 Q90 260 85 268 L106 268 Z" fill="#92400e" />
      <path d="M134 255 Q150 260 155 268 L134 268 Z" fill="#92400e" />
      <ellipse cx="120" cy="148" rx="80" ry="65" fill="#86efac" />
      <ellipse cx="120" cy="138" rx="68" ry="56" fill="#4ade80" />
      <ellipse cx="120" cy="128" rx="52" ry="44" fill="#22c55e" />
      <circle cx="68" cy="145" r="32" fill="#4ade80" />
      <circle cx="172" cy="145" r="32" fill="#4ade80" />
      <circle cx="120" cy="88" r="36" fill="#22c55e" />
      <circle cx="100" cy="100" r="16" fill="#16a34a" opacity="0.5" />
      <circle cx="138" cy="110" r="12" fill="#15803d" opacity="0.4" />
    </g>
  )
}

function Mature() {
  return (
    <g>
      <path d="M103 268 Q96 235 104 188 L136 188 Q144 235 137 268 Z" fill="#78350f" />
      <path d="M104 250 Q82 258 74 268 L104 268 Z" fill="#92400e" />
      <path d="M136 250 Q158 258 166 268 L136 268 Z" fill="#92400e" />
      <path d="M113 210 Q112 230 113 250" stroke="#92400e" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M127 205 Q128 228 127 252" stroke="#92400e" strokeWidth="2" fill="none" opacity="0.5" />
      <ellipse cx="120" cy="138" rx="95" ry="72" fill="#86efac" />
      <circle cx="52" cy="148" r="44" fill="#86efac" />
      <circle cx="188" cy="148" r="44" fill="#86efac" />
      <ellipse cx="120" cy="125" rx="80" ry="62" fill="#4ade80" />
      <ellipse cx="120" cy="112" rx="62" ry="50" fill="#22c55e" />
      <circle cx="68" cy="128" r="36" fill="#4ade80" />
      <circle cx="172" cy="128" r="36" fill="#4ade80" />
      <circle cx="120" cy="72" r="44" fill="#22c55e" />
      <circle cx="120" cy="60" r="30" fill="#16a34a" />
      <circle cx="96" cy="88" r="20" fill="#15803d" opacity="0.45" />
      <circle cx="148" cy="100" r="15" fill="#166534" opacity="0.35" />
      <circle cx="76" cy="115" r="14" fill="#15803d" opacity="0.4" />
      <circle cx="162" cy="115" r="14" fill="#15803d" opacity="0.4" />
    </g>
  )
}
