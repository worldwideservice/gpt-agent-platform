import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: true,
  dts: true,
  outDir: 'dist',
  clean: true,
  // Разрешаем динамические импорты из lib/ как внешние (резолвятся во время выполнения)
  // Используем паттерны, которые не будут проверяться esbuild во время сборки
  external: [
    /\.\.\/lib\//,
    /\.\.\/\.\.\/lib\//,
  ],
  // Отключаем проверку модулей для динамических импортов
  noExternal: [],
  // Разрешаем импорты из ../lib/
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  esbuildOptions(options) {
    // Разрешаем импорты из lib/
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx']
  },
})

