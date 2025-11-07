import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'

// Динамически импортируем logger после установки NODE_ENV
// Это гарантирует что logger создастся с правильным NODE_ENV
let logger: any

describe('Logger', () => {
  beforeAll(async () => {
    // Устанавливаем NODE_ENV перед импортом logger
    process.env.NODE_ENV = 'development'
    // Динамический импорт после установки NODE_ENV
    const loggerModule = await import('@/lib/utils/logger')
    logger = loggerModule.logger
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('logger methods', () => {
    it('should have debug method', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      
      logger.debug('Test debug message')
      
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should have info method', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      
      logger.info('Test info message')
      
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should have warn method', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      logger.warn('Test warn message')
      
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should have error method', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      logger.error('Test error message')
      
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    it('should have performance method', () => {
      // performance вызывает debug в development, если duration <= 1000
      // или warn, если duration > 1000
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Используем duration > 1000, чтобы вызвать warn (который всегда вызывается)
      logger.performance('Test performance message', 1500)
      
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })
})

