import { describe, it, expect } from 'vitest'
import { NextResponse } from 'next/server'

import { registerSchema } from '@/lib/validation/schemas/auth'
import { validateRequest } from '@/lib/validation/validate'

describe('Validation Schemas & Helper', () => {
  // Тестирование registerSchema
  describe('registerSchema', () => {
    it('должен пропустить валидные данные', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('должен пропустить данные с organizationName', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: 'My Company',
      }
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('должен отклонить пустое имя', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: '', // Пустое
        lastName: 'Doe',
      }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toContain('required')
    })

    it('должен отклонить невалидный email', () => {
      const invalidData = {
        email: 'not-an-email', // Невалидный email
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toContain('Invalid email')
    })

    it('должен отклонить короткий пароль', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123', // Слишком короткий
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toContain('at least 8 characters')
    })
  })

  // Тестирование validateRequest хелпера
  describe('validateRequest Helper', () => {
    it('должен вернуть данные при валидном JSON', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const request = new Request('http://test.com', {
        method: 'POST',
        body: JSON.stringify(validData),
      })

      const { data, error } = await validateRequest(request, registerSchema)
      expect(error).toBe(null)
      expect(data).toEqual(validData)
    })

    it('должен вернуть 400 при невалидном JSON (Zod error)', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123', // Короткий пароль
        firstName: 'John',
        lastName: 'Doe',
      }
      const request = new Request('http://test.com', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })

      const { data, error } = await validateRequest(request, registerSchema)
      expect(data).toBe(null)
      expect(error).toBeInstanceOf(NextResponse)
      expect(error?.status).toBe(400)

      const json = await error.json()
      expect(json.error).toBe('Validation Failed')
      expect(json.issues[0].path).toBe('password')
    })

    it('должен вернуть 400 при синтаксической ошибке JSON', async () => {
      const malformedJson = '{ "name": "test", ' // Отсутствует закрывающая скобка
      const request = new Request('http://test.com', {
        method: 'POST',
        body: malformedJson,
      })

      const { data, error } = await validateRequest(request, registerSchema)
      expect(data).toBe(null)
      expect(error).toBeInstanceOf(NextResponse)
      expect(error?.status).toBe(400)
      expect(await error.json()).toEqual({ error: 'Invalid JSON body' })
    })
  })
})
