import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: true,
  dts: true,
  outDir: 'dist',
  clean: true,
  // Разрешаем динамические импорты из lib/ как внешние (резолвятся во время выполнения)
  external: [
    '../lib/**/*',
    '../../../lib/**/*',
  ],
  // Разрешаем импорты из ../lib/
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  esbuildOptions(options) {
    // Разрешаем импорты из lib/
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx']
  },
})

