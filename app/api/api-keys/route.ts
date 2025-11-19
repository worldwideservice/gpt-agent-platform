// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { createApiKeySchema } from '@/lib/validation/schemas/account-settings'


/**
 * GET /api/api-keys
 * Получение списка API ключей пользователя
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // [MOCK] В реальном проекте - запрос к БД
    const mockApiKeys = [
      {
        id: '1',
        name: 'Production Key',
        key: 'pk_live_****************************abc',
        description: 'Main production API key',
        createdAt: new Date('2024-01-15').toISOString(),
        lastUsedAt: new Date('2024-01-20').toISOString(),
        expiresAt: null,
      },
    ]

    return NextResponse.json(mockApiKeys)
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}

/**
 * POST /api/api-keys
 * Создание нового API ключа
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = createApiKeySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { name, description, expiresAt } = validation.data

    // [MOCK] В реальном проекте:
    // 1. Сгенерировать случайный API ключ
    // 2. Сохранить хеш в БД
    // 3. Вернуть ключ только один раз (нельзя будет восстановить)

    const mockNewKey = {
      id: Date.now().toString(),
      name,
      key: `pk_live_${Math.random().toString(36).substring(2, 34)}`,
      description,
      createdAt: new Date().toISOString(),
      expiresAt,
    }

    // eslint-disable-next-line no-console
    console.log(`[MOCK] API key created for user ${session.user.id}:`, name)

    return NextResponse.json(mockNewKey, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
