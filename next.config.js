/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // AdSense Auto Ads also loads its ad-traffic-quality (sodar) script from
              // *.adtrafficquality.google; without it every page logs a CSP console error.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://*.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              // GA4 (gtag) posts hits to google-analytics.com / google.com/g/collect and
              // regional *.analytics.google.com; AdSense Auto Ads calls adtrafficquality.google.
              // Without these the calculator_* events (and every page_view) are blocked by CSP.
              "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://*.adtrafficquality.google https://googleads.g.doubleclick.net",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  async redirects() {
    return []
  },
}

module.exports = nextConfig
