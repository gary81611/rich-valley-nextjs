import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rva: {
          forest: '#2C3E2D',
          'forest-dark': '#1a2a1b',
          /** Same as copper-700. The old #B87333 fails WCAG AA on cream. */
          copper: '#9A5B24',
          'copper-light': '#d4956a',
          /** Text and filled buttons on cream. The old #B87333 fails WCAG AA at body size. */
          'copper-300': '#E8C4A0',
          'copper-700': '#9A5B24',
          'copper-800': '#7A481C',
          cream: '#F7F4EF',
          'cream-dark': '#E8E2D8',
          sage: '#8BA888',
        },
        alp: {
          navy: '#1B2338',
          'navy-deep': '#111827',
          gold: '#C9A84C',
          'gold-light': '#E0C878',
          /** Text on white and pearl. #C9A84C is for fills and for text on navy. */
          'gold-700': '#8A6A1C',
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
