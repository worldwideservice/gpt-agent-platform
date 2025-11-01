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
    // Создаём pages-manifest.json для Pages Router СИНХРОННО при загрузке конфигурации
    // Это гарантирует, что файл будет создан до того, как Next.js попытается его прочитать
    if (!dev && isServer) {
      try {
        const fs = require('fs')
        const path = require('path')
        const pagesDir = path.join(process.cwd(), 'pages')
        const pagesManifestPath = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json')
        
        // Проверяем только один раз - при загрузке webpack конфигурации
        if (fs.existsSync(pagesDir)) {
          const apiDir = path.join(pagesDir, 'api')
          
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
            
            // Создаём директорию если её нет
            const serverDir = path.join(process.cwd(), '.next', 'server')
            if (!fs.existsSync(serverDir)) {
              fs.mkdirSync(serverDir, { recursive: true })
            }
            
            // Создаём файл только если его ещё нет
            if (Object.keys(pagesManifest).length > 0) {
              fs.writeFileSync(pagesManifestPath, JSON.stringify(pagesManifest, null, 2))
              console.log('webpack: created pages-manifest.json with', Object.keys(pagesManifest).length, 'routes')
            }
          }
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

    return config
  },
}

const withNextIntl = createNextIntlPlugin()

module.exports = withNextIntl(nextConfig)

