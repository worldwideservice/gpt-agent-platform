const createNextIntlPlugin = require('next-intl/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Строгие проверки для качественного кода
  typescript: {
    ignoreBuildErrors: false, // Не игнорируем ошибки TypeScript
  },
  eslint: {
    ignoreDuringBuilds: false, // Не игнорируем ошибки ESLint
  },

  // Оптимизации для продакшена
  swcMinify: true,

  // Настройки изображений
  images: {
    domains: ['localhost', 'vercel.app', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 86400, // 24 hours
  },

  // Экспериментальные функции
  experimental: {
    // Включаем App Router оптимизации
    optimizePackageImports: ['lucide-react'],
    // Включаем SWC оптимизации
    swcPlugins: [],
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Webpack конфигурация
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Добавляем оптимизации для продакшена
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name: 'lib',
          priority: 30,
          chunks: 'all',
        },
      }
    }

    return config
  },
}

const withNextIntl = createNextIntlPlugin()

module.exports = withNextIntl(nextConfig)

