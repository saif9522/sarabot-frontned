import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B1B3A', 800: '#13284F', 700: '#1E3A6E', 600: '#2A4475' },
        ink: '#1E293B',
        muted: '#475569',
        line: '#CBD5E1',
        canvas: '#F3F5FB',
        // WhatsApp-adjacent green, darkened for AA contrast with white text
        brand: { DEFAULT: '#0B7A5C', dark: '#075E46', tint: '#E8F6F1', edge: '#A9DCC9', glow: '#25D366' },
        tech: { DEFAULT: '#1D4ED8', tint: '#EFF4FF', edge: '#BFD3FE' },
        ai: { DEFAULT: '#6D28D9', tint: '#F5F0FF', edge: '#D6C6FA' },
        auto: { DEFAULT: '#C2410C', tint: '#FFF4EC', edge: '#F8C9A4' },
        err: { DEFAULT: '#B91C1C', tint: '#FEF1F1', edge: '#F3BDBD' },
        // Colourful accents. Each "DEFAULT" keeps white text readable (contrast 4.5:1 or more).
        c: {
          indigo: '#4F46E5', 'indigo-tint': '#EEF0FF',
          violet: '#7C3AED', 'violet-tint': '#F3EEFF',
          blue: '#2563EB', 'blue-tint': '#EAF1FF',
          sky: '#0369A1', 'sky-tint': '#E6F4FB',
          green: '#047857', 'green-tint': '#E6F6EF',
          orange: '#C2410C', 'orange-tint': '#FFF0E6',
          amber: '#B45309', 'amber-tint': '#FFF6E0',
          pink: '#BE185D', 'pink-tint': '#FDEBF3',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
