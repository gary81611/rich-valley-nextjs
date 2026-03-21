import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rva: {
          forest: '#2C3E2D',
          'forest-dark': '#1a2a1b',
          copper: '#B87333',
          'copper-light': '#d4956a',
          cream: '#F7F4EF',
          'cream-dark': '#E8E2D8',
          sage: '#8BA888',
        },
        alp: {
          navy: '#1B2338',
          'navy-deep': '#111827',
          gold: '#C9A84C',
          'gold-light': '#E0C878',
          pearl: '#F1F3F6',
          'pearl-dark': '#D8DCE3',
          slate: '#64748B',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
