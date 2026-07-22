import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jimopropertydevelopment.com'
  ),
  title: {
    default: 'Jimo Property Development | Premium Real Estate in Lagos',
    template: '%s | Jimo Property Development',
  },
  description:
    'Premium residential, hospitality, and investment-led real estate developments in Lagos, Nigeria.',
  keywords: [
    'real estate development Lagos',
    'property development company Lagos',
    'premium apartments Yaba',
    'real estate investment Nigeria',
    'shortlet investment Lagos',
    'Jimo Property Development',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Jimo Property Development',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Jimopropertydevelopment',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}