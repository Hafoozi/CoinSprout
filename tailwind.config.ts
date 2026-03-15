import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // CoinSprout brand palette
        sprout: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // primary green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // interest / gold fruit
          600: '#d97706',
        },
        bark: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f3d9a8',
          300: '#e8bc6e',
          400: '#d4963a', // tree trunk brown
          500: '#b8762a',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
