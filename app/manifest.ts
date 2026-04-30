import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'CoinSprout',
    short_name:       'CoinSprout',
    description:      'Grow your savings, one coin at a time.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#f0fdf4',
    theme_color:      '#16a34a',
    orientation:      'portrait',
    icons: [
      {
        src:   '/icons/icon-192.png',
        sizes: '192x192',
        type:  'image/png',
      },
      {
        src:     '/icons/icon-512.png',
        sizes:   '512x512',
        type:    'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
