import type { Config } from 'tailwindcss'

// Design-refresh tokens (2026-09). The canonical values live as CSS custom
// properties in app/globals.css; these Tailwind aliases exist so utility
// classes (text-ink, bg-paper, border-line, …) resolve to the same tokens.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: { DEFAULT: '#FAF7F2', 2: '#F3EEE6' },
        surface: '#FFFFFF',
        line: { DEFAULT: '#E3DCD0', strong: '#CFC6B8' },
        ink: { DEFAULT: '#1B2430', 2: '#334151', 3: '#5B6774' },
        accent: { DEFAULT: '#0E5E52', deep: '#0A4A41', tint: '#E6F1EC', line: '#BFDBD1' },
        amber: { DEFAULT: '#8A5200', tint: '#FFF3DB', line: '#E9C98A' },
        danger: { DEFAULT: '#B3261E', tint: '#FBEAE8', line: '#EBB4AE' },
        // Legacy alias kept so any lingering brand.* utility still compiles.
        brand: {
          bg: '#FAF7F2',
          secondary: '#F3EEE6',
          blue: '#0E5E52',
          emerald: '#0E5E52',
          gold: '#8A5200',
          heading: '#1B2430',
          body: '#334151',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,36,48,0.06), 0 6px 20px rgba(27,36,48,0.06)',
        pop: '0 12px 32px rgba(27,36,48,0.14)',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}

export default config
