import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CoinSprout',
  description: 'Grow your savings, one coin at a time.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'CoinSprout',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  icons: {
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
