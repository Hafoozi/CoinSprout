import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://coinsproutapp.com'),
  title: 'CoinSprout',
  description: 'Where savings turns into something bigger.',
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
  openGraph: {
    title: 'CoinSprout',
    description: 'Where savings turns into something bigger.',
    url: 'https://coinsproutapp.com',
    siteName: 'CoinSprout',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoinSprout',
    description: 'Where savings turns into something bigger.',
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
