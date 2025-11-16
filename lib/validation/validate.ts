/* eslint-disable no-console */
import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

/**
 * Парсит и валидирует тело JSON-запроса с помощью Zod-схемы.
 * Возвращает стандартизированный ответ с ошибкой 400 в случае неудачи.
 *
 * @param request - Входящий NextRequest.
 * @param schema - Zod-схема для валидации.
 * @returns {Promise<{ data: T } | NextResponse>} - Объект с данными или NextResponse с ошибкой.
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.Schema<T>,
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const json = await request.json()
    const parsedData = schema.parse(json)
    return { data: parsedData, error: null }
  } catch (e) {
    if (e instanceof ZodError) {
      // Форматируем ошибки для клиента
      const errors = e.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Validation Failed',
            issues: errors,
          },
          { status: 400 },
        ),
      }
    }

    // Ошибка, если тело запроса не JSON
    if (e instanceof SyntaxError) {
      return {
        data: null,
        error: NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 },
        ),
      }
    }

    // Другие неожиданные ошибки
    console.error('[VALIDATE_REQUEST_ERROR]', e)
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      ),
    }
  }
}
