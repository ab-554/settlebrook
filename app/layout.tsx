// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx  —  Root layout: Plus Jakarta Sans + Inter fonts, metadata,
// Header, Footer. Design v2 (2026-09-25): cool, clean, financial-trust theme.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdsenseScript from '@/components/ads/AdsenseScript'
import './globals.css'

// Both are variable fonts: one file each, self-hosted by next/font, no
// third-party request at runtime.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// FIX C1: Organization JSON-LD — added to root layout so it appears on every page
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Settlebrook',
  url: 'https://www.settlebrook.com',
  logo: 'https://www.settlebrook.com/logo.png',
  description:
    'Free legal settlement calculators for personal injury and workplace injury claims in the United States.',
  foundingDate: '2024',
  areaServed: 'US',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'contact@settlebrook.com',
    url: 'https://www.settlebrook.com/contact/',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.settlebrook.com'),
  title: {
    default: 'Settlebrook — Free Legal Settlement Calculators',
    template: '%s | Settlebrook',
  },
  // FIX H1: trimmed from 161 → 151 chars
  description:
    'Free personal injury settlement calculators for USA accident victims. Estimate pain and suffering, car accident, and workers comp settlements instantly.',
  authors: [{ name: 'Settlebrook' }],
  creator: 'Settlebrook',
  publisher: 'Settlebrook',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // FIX C2: Added title and description to root OG so stub/future pages get social cards
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Settlebrook',
    title: 'Settlebrook — Free Legal Settlement Calculators',
    description:
      'Free personal injury settlement calculators for USA accident victims. Estimate pain and suffering, car accident, and workers comp settlements instantly.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Settlebrook — Free Personal Injury Settlement Calculators' }],
  },
  // FIX M1: Added twitter.site handle
  twitter: { card: 'summary_large_image', site: '@settlebrook', images: ['/og-image.png'] },
  // app/icon.svg (file convention) adds the SVG icon link automatically; the
  // ICO carries 16/32/48 for older browsers and Google's ≥48px requirement.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F6F8FB" />
        <meta name="google-site-verification" content="cGsiOQ_EMINsvgTrz-26yjwmn03QBNsuYxVK5cJrPzQ" />
        {/* FIX C1: Organization JSON-LD on every page for E-E-A-T signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-body" style={{ backgroundColor: 'var(--bg)', color: 'var(--ink-2)' }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 text-sm font-semibold px-4 py-3 rounded-lg z-50"
          style={{ background: 'var(--ink)', color: '#FFFFFF' }}
        >
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="flex-1">{children}</div>
        <Footer />
        <GoogleAnalytics gaId="G-K3PV0YLHFG" />
        {/* Skipped on the not-found page — see components/ads/AdsenseScript.tsx */}
        <AdsenseScript />
      </body>
    </html>
  )
}
