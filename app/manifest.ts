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
        src:   '/apple-icon',
        sizes: '180x180',
        type:  'image/png',
      },
      {
        src:   '/icon',
        sizes: '32x32',
        type:  'image/png',
      },
    ],
  }
}
