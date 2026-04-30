interface Props {
  size?: number
}

export default function CoinSproutLogo({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="125 128 305 305"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#0F7A3B" />
        </linearGradient>
        <radialGradient id="cs-coin" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </radialGradient>
        <linearGradient id="cs-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="110" fill="url(#cs-bg)" />

      <circle cx="235" cy="320" r="90" fill="url(#cs-coin)" />
      <circle cx="235" cy="320" r="70" fill="none" stroke="#CA8A04" strokeWidth="10" />

      <path
        d="M235 260 C240 235, 270 210, 320 175"
        stroke="#14532D"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M270 190 C240 175, 210 185, 210 215 C245 220, 260 205, 270 190 Z"
        fill="url(#cs-leaf)"
      />
      <path
        d="M320 175 C370 150, 410 170, 410 215 C360 225, 330 205, 320 175 Z"
        fill="url(#cs-leaf)"
      />
    </svg>
  )
}
