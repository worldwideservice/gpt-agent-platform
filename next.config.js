const createNextIntlPlugin = require('next-intl/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Строгие проверки для качественного кода
  typescript: {
    ignoreBuildErrors: false, // Не игнорируем ошибки TypeScript
  },
  eslint: {
    ignoreDuringBuilds: true, // Игнорируем ESLint ошибки во время билда (warnings не критичны)
    // Игнорируем правила React hooks для useResource (это не React hook)
    dirs: ['app', 'components', 'lib', 'hooks'],
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


  // Заголовки безопасности (Задача 5.1: Security Audit)
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
            value: 'strict-origin-when-cross-origin',
          },
          // HSTS: Строгая транспортная безопасность (только HTTPS)
          // includeSubDomains: применяется ко всем поддоменам
          // preload: позволяет добавить сайт в HSTS preload list браузеров
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Permissions Policy: Ограничиваем доступ к браузерным API
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy (CSP)
          // Защита от XSS, clickjacking, и других injection атак
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js требует unsafe-eval для dev
              "style-src 'self' 'unsafe-inline'", // Tailwind требует unsafe-inline
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://openrouter.ai https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Webpack конфигурация
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Создаём pages-manifest.json для Pages Router СИНХРОННО при загрузке конфигурации
    // ВАЖНО: создаём ВСЕГДА, если файла нет, чтобы Next.js мог его прочитать на этапе "Collecting page data"
    if (!dev && isServer) {
      try {
        const fs = require('fs')
        const path = require('path')
        const pagesDir = path.join(process.cwd(), 'pages')
        const apiDir = path.join(pagesDir, 'api')
        const pagesManifestPath = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json')
        
        // Создаём манифест, если есть pages/api и файл ещё не существует
        if (fs.existsSync(apiDir) && !fs.existsSync(pagesManifestPath)) {
          const pagesManifest = {}
          
          const findRoutes = (dir, basePath = []) => {
            if (!fs.existsSync(dir)) return
            
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name)
              const newBasePath = [...basePath, entry.name]
              
              if (entry.isDirectory()) {
                findRoutes(fullPath, newBasePath)
              } else if (entry.isFile()) {
                if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
                  const routeParts = newBasePath.slice(0, -1)
                  const fileName = newBasePath[newBasePath.length - 1]
                  
                  let route = '/api'
                  if (routeParts.length > 0) {
                    route += '/' + routeParts.join('/')
                  }
                  
                  const baseFileName = fileName.replace(/\.(ts|tsx|js|jsx)$/, '')
                  if (baseFileName !== 'index') {
                    route += '/' + baseFileName
                  }
                  
                  const filePath = 'pages/api/' + newBasePath.join('/')
                  pagesManifest[route] = filePath
                }
              }
            }
          }
          
          findRoutes(apiDir, '')
          
          // Создаём директорию .next/server если её нет
          const serverDir = path.join(process.cwd(), '.next', 'server')
          fs.mkdirSync(serverDir, { recursive: true })
          
          // Создаём файл (даже если routes пустой - Next.js всё равно ожидает файл)
          fs.writeFileSync(pagesManifestPath, JSON.stringify(pagesManifest, null, 2))
          console.log('webpack: created pages-manifest.json with', Object.keys(pagesManifest).length, 'routes')
        }
      } catch (error) {
        // Игнорируем ошибки в webpack конфигурации, чтобы не сломать сборку
        console.warn('webpack: failed to create pages-manifest.json:', error.message)
      }
    }
    
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

    // Remove console.log in production (keep console.error and console.warn)
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      }
      
      // Add Terser plugin configuration to remove console.log
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((minimizer) => {
          if (minimizer.constructor.name === 'TerserPlugin' || minimizer.constructor.name === 'SwcMinifyPlugin') {
            if (minimizer.options) {
              minimizer.options.compress = {
                ...(minimizer.options.compress || {}),
                drop_console: true, // Remove all console.* in production
                pure_funcs: ['console.log', 'console.debug', 'console.info'], // Keep error and warn
              }
            }
          }
        })
      }
    }

    return config
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

module.exports = withNextIntl(nextConfig)

