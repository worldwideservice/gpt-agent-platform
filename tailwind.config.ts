import type { Config } from 'tailwindcss'

import {
  basePalette,
  semanticColorTokens,
  chartColorTokens,
  radiusTokens,
  fontTokens,
  brandTokens,
} from './design-tokens'

const config: Config = {
 darkMode: ['class'],
 content: [
 './pages/**/*.{js,ts,jsx,tsx,mdx}',
 './components/**/*.{js,ts,jsx,tsx,mdx}',
 './app/**/*.{js,ts,jsx,tsx,mdx}',
 './lib/**/*.{js,ts,jsx,tsx,mdx}',
 ],
  theme: {
    extend: {
      colors: {
        ...basePalette,
        ...semanticColorTokens,
        chart: chartColorTokens,
        brand: brandTokens,
      },
      borderRadius: radiusTokens,
      fontFamily: fontTokens,
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        aurora: 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config

