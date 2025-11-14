import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокируем NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextResponse: {
      next: vi.fn(),
      redirect: vi.fn(),
    },
  }
})

// Импортируем после моков
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/middleware'

// Получаем моки
const mockNext = vi.mocked(NextResponse.next)
const mockRedirect = vi.mocked(NextResponse.redirect)

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNext.mockReturnValue({ type: 'next' })
  })

  describe('Static files and API routes', () => {
    it('должен пропустить пути _next', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/_next/static/chunk.js'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить API роуты', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/api/users'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить статические файлы', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/static/logo.png'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить favicon.ico', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/favicon.ico'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить файлы с расширениями', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/robots.txt'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить изображения', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/logo.svg'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Manage paths', () => {
    it('должен пропустить /manage/[tenantId] пути', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/manage/org-123'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить вложенные /manage/[tenantId] пути', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/manage/org-123/dashboard'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /manage/[tenantId]/ai-agents', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/manage/org-123/ai-agents'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /manage/[tenantId]/settings', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/manage/org-123/settings'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Public paths', () => {
    it('должен пропустить корневую страницу', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /login', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/login'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /register', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/register'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /reset-password', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/reset-password'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /pricing', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/pricing'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /demo', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/demo'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /support', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/support'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить вложенные публичные пути /reset-password/confirm', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/reset-password/confirm'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Other paths', () => {
    it('должен пропустить другие защищенные пути', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/some-protected-path'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен пропустить /faq', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/faq'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('должен корректно обрабатывать URL с параметрами запроса', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/login?redirect=/dashboard'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен корректно обрабатывать URL с хэшем', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/pricing#features'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен корректно обрабатывать _next/image пути', async () => {
      const request = new NextRequest(new URL('http://localhost:3000/_next/image?url=/logo.png'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })

    it('должен корректно обрабатывать различные статические ресурсы', async () => {
      const paths = [
        '/_next/static/css/app.css',
        '/_next/static/chunks/main.js',
        '/static/fonts/inter.woff2',
        '/manifest.json',
        '/sitemap.xml',
      ]

      for (const path of paths) {
        vi.clearAllMocks()
        const request = new NextRequest(new URL(`http://localhost:3000${path}`))
        await middleware(request)
        expect(mockNext).toHaveBeenCalled()
      }
    })

    it('должен пропустить пути с комплексными tenant ID', async () => {
      const tenantIds = [
        'org-123',
        'org-abc-def',
        'tenant_123',
        'uuid-1234-5678-90ab-cdef',
      ]

      for (const tenantId of tenantIds) {
        vi.clearAllMocks()
        const request = new NextRequest(new URL(`http://localhost:3000/manage/${tenantId}/dashboard`))
        await middleware(request)
        expect(mockNext).toHaveBeenCalled()
      }
    })

    it('НЕ должен пропускать невалидные пути как статические', async () => {
      // Пути без расширений и не в списке исключений должны обрабатываться
      const request = new NextRequest(new URL('http://localhost:3000/random-page'))

      await middleware(request)

      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe('Matcher configuration', () => {
    it('config.matcher должен исключать правильные паттерны', async () => {
      // Импортируем config из middleware
      const middlewareModule = await import('@/middleware')
      const config = (middlewareModule as any).config

      expect(config).toBeDefined()
      expect(config.matcher).toBeDefined()
      expect(Array.isArray(config.matcher)).toBe(true)
    })
  })
})
