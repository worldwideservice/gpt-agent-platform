import { mergeConfig, defineConfig } from 'vitest/config'

import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['tests/unit/**/*.test.ts', 'tests/hooks/**/*.test.ts', 'tests/lib/**/*.test.ts'],
      exclude: ['tests/components/**', 'tests/integration/**'],
    },
  }),
)
