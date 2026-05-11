import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        brand: {
          bg:        '#0A0F1E',
          secondary: '#111827',
          blue:      '#3B82F6',
          emerald:   '#10B981',
          gold:      '#F59E0B',
          heading:   '#F9FAFB',
          body:      '#9CA3AF',
        },
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
}

export default config
