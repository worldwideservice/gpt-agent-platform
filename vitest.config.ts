import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    // Временно отключен для ускорения unit/integration тестов
    // storybookTest({ configDir: path.join(dirname, '.storybook') }),
  ],
  test: {
    globals: true,
    environment: 'node', // По умолчанию node, переопределяется в проектах
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], // Включаем .test.tsx для компонентных тестов
    exclude: ['node_modules', '.next', 'dist'],
    setupFiles: ['./tests/setup.ts'],
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
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '.next/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
      ],
      // Coverage отключен по умолчанию - включать только через --coverage флаг
      enabled: false,
    },
    projects: [
      {
        name: 'unit',
        extends: true,
        test: {
          include: ['tests/unit/**/*.test.ts'],
          exclude: ['tests/components/**', 'tests/integration/**'],
        },
      },
      {
        name: 'integration',
        extends: true,
        test: {
          include: ['tests/integration/**/*.test.ts'],
          exclude: ['tests/components/**', 'tests/unit/**'],
        },
      },
      {
        name: 'components',
        extends: true,
        test: {
          name: 'components',
          include: ['tests/components/**/*.test.tsx'],
          exclude: ['node_modules', '.next', 'dist', 'tests/unit/**', 'tests/integration/**'],
          environment: 'jsdom', // Для тестирования React компонентов
        },
      },
      // Временно отключен Storybook проект для ускорения тестов
      // {
      //   extends: true,
      //   plugins: [
      //     storybookTest({ configDir: path.join(dirname, '.storybook') }),
      //   ],
      //   test: {
      //     name: 'storybook',
      //     browser: {
      //       enabled: true,
      //       headless: true,
      //       provider: playwright({}),
      //       instances: [{ browser: 'chromium' }],
      //     },
      //     setupFiles: ['.storybook/vitest.setup.ts'],
      //   },
      // },
    ],
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
