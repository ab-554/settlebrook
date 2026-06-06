// ─────────────────────────────────────────────────────────────────────────────
// app/layout.tsx  —  Root layout: Inter + Bitter fonts, metadata, Header, Footer
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// FIX C1: Organization JSON-LD — added to root layout so it appears on every page
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Settlebrook',
  url: 'https://settlebrook.com',
  logo: 'https://settlebrook.com/logo.png',
  description:
    'Free legal settlement calculators for personal injury and workplace injury claims in the United States.',
  foundingDate: '2024',
  areaServed: 'US',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'contact.ab554@gmail.com',
    url: 'https://settlebrook.com/contact/',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://settlebrook.com'),
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
  icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050A18" />
        <meta name="google-site-verification" content="cGsiOQ_EMINsvgTrz-26yjwmn03QBNsuYxVK5cJrPzQ" />
        {/* FIX C1: Organization JSON-LD on every page for E-E-A-T signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col"
        style={{ backgroundColor: '#080D1A', color: '#E2E8F0', fontFamily: 'var(--font-body)' }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 text-white text-sm font-semibold px-4 py-2 rounded-lg z-50"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
        >
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="flex-1">{children}</div>
        <Footer />
        <GoogleAnalytics gaId="G-K3PV0YLHFG" />
        <Script
          id="adsense-init"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9642525412838279"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
