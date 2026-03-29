import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1e293b',
            a: {
              color: '#1d4ed8',
              '&:hover': { color: '#1e40af' },
            },
            'h1,h2,h3,h4': {
              color: '#0f172a',
              fontWeight: '700',
            },
            code: {
              backgroundColor: '#f1f5f9',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '400',
            },
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
            blockquote: {
              borderLeftColor: '#1d4ed8',
              backgroundColor: '#eff6ff',
              padding: '1rem 1.25rem',
              borderRadius: '0 8px 8px 0',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
