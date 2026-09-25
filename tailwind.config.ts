import type { Config } from 'tailwindcss'

// Design v2 tokens (2026-09-25). The canonical values live as CSS custom
// properties in app/globals.css; these Tailwind aliases exist so utility
// classes (text-ink, bg-surface, border-line, text-primary, text-money, …)
// resolve to the same tokens.
//
// The font-size scale is remapped in px so that no Tailwind text utility can
// render below 14px (text-xs = 14px) and body copy is 18px (text-base).
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      xs:   ['14px', { lineHeight: '1.45' }],
      sm:   ['16px', { lineHeight: '1.5' }],
      base: ['18px', { lineHeight: '1.6' }],
      lg:   ['20px', { lineHeight: '1.5' }],
      xl:   ['22px', { lineHeight: '1.4' }],
      '2xl': ['26px', { lineHeight: '1.3' }],
      '3xl': ['32px', { lineHeight: '1.2' }],
      '4xl': ['40px', { lineHeight: '1.15' }],
      '5xl': ['52px', { lineHeight: '1.08' }],
      '6xl': ['60px', { lineHeight: '1.05' }],
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: { DEFAULT: '#F6F8FB', 2: '#EEF3FF' },
        surface: '#FFFFFF',
        line: { DEFAULT: '#E2E8F0', strong: '#CBD5E1' },
        ink: { DEFAULT: '#0F1B2D', 2: '#334155', 3: '#5B6776' },
        primary: { DEFAULT: '#1D4ED8', deep: '#1E3A8A', tint: '#EAF0FF', line: '#C7D7FE' },
        money: { DEFAULT: '#047857', deep: '#065F46', tint: '#E7F6EF', line: '#A7DFC6' },
        amber: { DEFAULT: '#B45309', tint: '#FFF4E5', line: '#F5C98A' },
        danger: { DEFAULT: '#B91C1C', tint: '#FDECEC', line: '#F3B4B4' },
        // v1 aliases kept so any lingering paper-*/accent-* utility still compiles.
        paper: { DEFAULT: '#F6F8FB', 2: '#EEF3FF' },
        accent: { DEFAULT: '#1D4ED8', deep: '#1E3A8A', tint: '#EAF0FF', line: '#C7D7FE' },
        brand: {
          bg: '#F6F8FB',
          secondary: '#EEF3FF',
          blue: '#1D4ED8',
          emerald: '#047857',
          gold: '#B45309',
          heading: '#0F1B2D',
          body: '#334155',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,27,45,0.05), 0 8px 24px rgba(15,27,45,0.06)',
        hover: '0 4px 10px rgba(15,27,45,0.06), 0 18px 40px rgba(15,27,45,0.10)',
        pop: '0 16px 48px rgba(15,27,45,0.16)',
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '14px',
        lg: '18px',
      },
      screens: {
        // Editorial three-column layout starts here (see .editorial-grid).
        edit: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
