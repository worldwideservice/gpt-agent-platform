import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEmail, sendPasswordResetEmail, sendEmailVerificationEmail, sendTemplateEmail } from '@/lib/services/email'

// Мокаем nodemailer
const mockTransporter = {
  sendMail: vi.fn(),
}

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => mockTransporter),
  },
}))

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Устанавливаем переменные окружения для тестов
    process.env.SMTP_PASS = 'test-password'
  })

  afterEach(() => {
    delete process.env.SMTP_PASS
  })

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test</p>',
      })

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<p>Test</p>',
        })
      )
    })

    it('should send email to multiple recipients', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const result = await sendEmail({
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Email',
        html: '<p>Test</p>',
      })

      expect(result).toBe(true)
      // В коде массив преобразуется в строку через join(', ')
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test1@example.com, test2@example.com',
        })
      )
    })

    it('should send email with text and html', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test</p>',
        text: 'Test',
      })

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Test',
          html: '<p>Test</p>',
        })
      )
    })

    it('should send email with custom from address', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      })

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        })
      )
    })

    it('should send email with attachments', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test</p>',
        attachments: [
          {
            filename: 'test.pdf',
            path: '/path/to/test.pdf',
          },
        ],
      })

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: [
            {
              filename: 'test.pdf',
              path: '/path/to/test.pdf',
            },
          ],
        })
      )
    })

    it('should return false on error', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'))

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test</p>',
      })

      expect(result).toBe(false)
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const resetUrl = 'https://example.com/reset?token=reset-token-123'
      const result = await sendPasswordResetEmail('test@example.com', 'reset-token-123', resetUrl)

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('Восстановление пароля'),
          html: expect.stringContaining(resetUrl),
        })
      )
    })

    it('should return false on error', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'))

      const resetUrl = 'https://example.com/reset?token=reset-token-123'
      const result = await sendPasswordResetEmail('test@example.com', 'reset-token-123', resetUrl)

      expect(result).toBe(false)
    })
  })

  describe('sendEmailVerificationEmail', () => {
    it('should send email verification email', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const verificationUrl = 'https://example.com/verify?token=verification-token-123'
      const result = await sendEmailVerificationEmail('test@example.com', 'verification-token-123', verificationUrl)

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('Подтвердите ваш email'),
          html: expect.stringContaining(verificationUrl),
        })
      )
    })

    it('should return false on error', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'))

      const verificationUrl = 'https://example.com/verify?token=verification-token-123'
      const result = await sendEmailVerificationEmail('test@example.com', 'verification-token-123', verificationUrl)

      expect(result).toBe(false)
    })
  })

  describe('sendTemplateEmail', () => {
    it('should send template email', async () => {
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'msg-123' })

      const htmlTemplate = '<p>Hello {{name}}, welcome!</p>'
      const result = await sendTemplateEmail(
        'test@example.com',
        'Welcome Email',
        htmlTemplate,
        { name: 'John' }
      )

      expect(result).toBe(true)
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Welcome Email',
          html: '<p>Hello John, welcome!</p>',
        })
      )
    })

    it('should return false on error', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'))

      const htmlTemplate = '<p>Hello!</p>'
      const result = await sendTemplateEmail(
        'test@example.com',
        'Test Email',
        htmlTemplate,
        {}
      )

      expect(result).toBe(false)
    })
  })
})

