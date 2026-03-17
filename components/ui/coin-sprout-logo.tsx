interface Props {
  size?: number
}

/**
 * CoinSprout brand logo — tree silhouette on green gradient.
 * Matches the PWA app icon.
 */
export default function CoinSproutLogo({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <clipPath id="rounded">
          <rect width="32" height="32" rx="7" ry="7" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="32" height="32" rx="7" ry="7" fill="url(#bg-grad)" />

      {/* Ground strip */}
      <rect x="0" y="27" width="32" height="5" fill="rgba(0,0,0,0.18)" clipPath="url(#rounded)" />

      {/* Trunk */}
      <rect x="13" y="19" width="6" height="9" rx="1.5" fill="rgba(0,0,0,0.40)" />

      {/* Canopy */}
      <ellipse cx="16" cy="15.5" rx="10" ry="9.5" fill="white" opacity="0.95" />
      <ellipse cx="16" cy="11.5" rx="7"  ry="6"   fill="white" opacity="0.75" />

      {/* Fruit */}
      <circle cx="11" cy="14" r="2.2" fill="#fbbf24" />
      <circle cx="11" cy="14" r="1.2" fill="#f59e0b" />
      <circle cx="21" cy="13.5" r="2.2" fill="#fbbf24" />
      <circle cx="21" cy="13.5" r="1.2" fill="#f59e0b" />
      <circle cx="16" cy="18" r="2.2" fill="#fbbf24" />
      <circle cx="16" cy="18" r="1.2" fill="#f59e0b" />
    </svg>
  )
}
