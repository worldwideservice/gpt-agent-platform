import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const isCI = process.env.CI === 'true';
const coverageEnabled = process.env.VITEST_COVERAGE === 'true' || isCI;
const reportSuffix = process.env.VITEST_REPORT_SUFFIX ? `-${process.env.VITEST_REPORT_SUFFIX}` : '';
const coverageDir = reportSuffix ? path.join('coverage', process.env.VITEST_REPORT_SUFFIX!) : 'coverage';

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'node', // По умолчанию node, переопределяется в проектах
    include: [],
    exclude: ['node_modules', '.next', 'dist'],
    setupFiles: ['./tests/setup.ts'],
    environmentMatchGlobs: [
      ['tests/hooks/**', 'jsdom'],
      ['tests/unit/hooks/**', 'jsdom'],
      ['tests/unit/**/*.test.tsx', 'jsdom'],
    ],
    // ОГРАНИЧИВАЕМ КОЛИЧЕСТВО ВОРКЕРОВ ДЛЯ СНИЖЕНИЯ НАГРУЗКИ НА НОУТБУК
    // Используем только 2 воркера вместо всех доступных ядер CPU
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 2, // Максимум 2 потока для снижения нагрузки
        minThreads: 1, // Минимум 1 поток
      },
    },
    // Кеширование включено по умолчанию в Vite
    // Используем стандартный cacheDir из Vite
    // Ограничиваем время выполнения тестов
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    coverage: {
      provider: 'v8',
      enabled: coverageEnabled,
      reportsDirectory: coverageDir,
      reporter: ['text', 'json-summary', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '.next/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/stories/**',
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 65,
        branches: 50,
      },
    },
    reporters: isCI
      ? [
          'default',
          ['junit', { outputFile: `test-results/vitest-junit${reportSuffix}.xml` }],
          ['json', { outputFile: `test-results/vitest-report${reportSuffix}.json` }],
        ]
      : ['default'],
  },
  resolve: {
    alias: {
      '@': dirname,
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  // Настройки для работы с Next.js
  esbuild: {
    target: 'node18',
    jsx: 'automatic', // Автоматический JSX transform
  },
});
