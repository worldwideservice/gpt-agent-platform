import type { Config } from 'tailwindcss'

import {
  basePalette,
  semanticColorTokens,
  chartColorTokens,
  radiusTokens,
  fontTokens,
  brandTokens,
  spacingTokens,
  shadowTokens,
  fontSizeTokens,
  fontWeightTokens,
  lineHeightTokens,
  durationTokens,
  easingTokens,
  zIndexTokens,
  breakpointTokens,
  sizeTokens,
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
    screens: breakpointTokens,
    extend: {
      colors: {
        ...basePalette,
        ...semanticColorTokens,
        chart: chartColorTokens,
        brand: brandTokens,
      },
      spacing: spacingTokens,
      borderRadius: radiusTokens,
      boxShadow: shadowTokens,
      fontFamily: fontTokens,
      fontSize: fontSizeTokens,
      fontWeight: fontWeightTokens,
      lineHeight: lineHeightTokens,
      transitionDuration: durationTokens,
      transitionTimingFunction: easingTokens,
      zIndex: zIndexTokens,
      width: sizeTokens,
      height: sizeTokens,
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
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(100%)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        aurora: 'aurora 60s linear infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config

