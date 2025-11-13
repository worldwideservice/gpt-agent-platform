import { mergeConfig, defineConfig } from 'vitest/config'

import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'components',
      include: ['tests/components/**/*.test.tsx'],
      exclude: ['node_modules', '.next', 'dist', 'tests/unit/**', 'tests/integration/**'],
      environment: 'jsdom',
    },
  }),
)
