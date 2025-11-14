export const basePalette = {
  custom: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#dc2626',
    600: '#b91c1c',
    700: '#991b1b',
    800: '#7f1d1d',
    900: '#7f1d1d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
} as const

export const semanticColorTokens = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
} as const

export const chartColorTokens = {
  1: 'hsl(var(--chart-1))',
  2: 'hsl(var(--chart-2))',
  3: 'hsl(var(--chart-3))',
  4: 'hsl(var(--chart-4))',
  5: 'hsl(var(--chart-5))',
} as const

// Spacing tokens extracted from KWID references
export const spacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const

// Border radius tokens from KWID references
export const radiusTokens = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const

// Shadow tokens from KWID references
export const shadowTokens = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  '2xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
} as const

// Typography tokens from KWID references
export const fontTokens = {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
} as const

export const fontSizeTokens = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const

export const fontWeightTokens = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const brandTokens = {
  accent: 'hsl(var(--brand-accent))',
  accentStrong: 'hsl(var(--brand-accent-strong))',
  accentForeground: 'hsl(var(--brand-accent-foreground))',
  focus: 'hsl(var(--focus-ring))',
} as const

// Line height tokens from KWID references
export const lineHeightTokens = {
  none: '1',
  tight: '1.2',
  snug: '1.3',
  normal: '1.5',
  relaxed: '1.6',
  loose: '1.8',
} as const

// Animation/Duration tokens from KWID references
export const durationTokens = {
  instant: '0ms',
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

// Easing function tokens
export const easingTokens = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// Z-index tokens from KWID references
export const zIndexTokens = {
  base: 1,
  sticky: 10,
  sidebar: 50,
  header: 100,
  dropdown: 200,
  overlay: 999,
  modal: 1000,
  notification: 2000,
  tooltip: 3000,
} as const

// Breakpoint tokens from KWID references
export const breakpointTokens = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const

// Component size tokens
export const sizeTokens = {
  // Icons
  'icon-xs': '12px',
  'icon-sm': '16px',
  'icon-md': '20px',
  'icon-lg': '24px',
  'icon-xl': '32px',

  // Avatars
  'avatar-sm': '24px',
  'avatar-md': '32px',
  'avatar-lg': '40px',
  'avatar-xl': '48px',

  // Inputs
  'input-sm': '32px',
  'input-md': '40px',
  'input-lg': '48px',

  // Buttons
  'button-sm': '32px',
  'button-md': '40px',
  'button-lg': '48px',
} as const

// Layout tokens from KWID references
export const layoutTokens = {
  // Header
  'header-height': '64px',

  // Sidebar
  'sidebar-width': '256px',
  'sidebar-width-collapsed': '64px',

  // Container
  'container-max-width': '1200px',
  'container-padding-desktop': '24px',
  'container-padding-tablet': '20px',
  'container-padding-mobile': '16px',

  // Content
  'content-max-width': '800px',
  'grid-gap': '24px',
} as const

export const designTokens = {
  colors: {
    palette: basePalette,
    semantic: semanticColorTokens,
    chart: chartColorTokens,
    brand: brandTokens,
  },
  spacing: spacingTokens,
  radii: radiusTokens,
  shadows: shadowTokens,
  fonts: fontTokens,
  fontSizes: fontSizeTokens,
  fontWeights: fontWeightTokens,
  lineHeights: lineHeightTokens,
  durations: durationTokens,
  easings: easingTokens,
  zIndex: zIndexTokens,
  breakpoints: breakpointTokens,
  sizes: sizeTokens,
  layout: layoutTokens,
} as const

export type DesignTokens = typeof designTokens
