// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { createErrorResponse } from '@/lib/utils/error-handler'
import { updateAgentStatus } from '@/lib/services/agents'

/**
 * Задача 4.2: Bulk Actions для агентов
 * API endpoint для массовых операций над агентами
 */

const bulkUpdateSchema = z.object({
  agentIds: z.array(z.string().uuid()).min(1, 'Необходимо выбрать хотя бы одного агента'),
  action: z.enum(['activate', 'deactivate', 'delete']),
})

/**
 * @swagger
 * /api/agents/bulk:
 *   patch:
 *     summary: Массовое обновление агентов
 *     description: Выполняет массовые операции над выбранными агентами
 *     tags:
 *       - Agents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agentIds
 *               - action
 *             properties:
 *               agentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Массив ID агентов для обновления
 *               action:
 *                 type: string
 *                 enum: [activate, deactivate, delete]
 *                 description: Действие для выполнения
 *     responses:
 *       200:
 *         description: Успешное выполнение операции
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updated:
 *                   type: integer
 *                   description: Количество обновленных агентов
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Неверные входные данные
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
export const PATCH = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = bulkUpdateSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Некорректные данные',
          details: issues,
        },
        { status: 400 },
      )
    }

    const { agentIds, action } = parsed.data

    // Выполняем массовую операцию
    let updated = 0

    if (action === 'activate' || action === 'deactivate') {
      const isActive = action === 'activate'

      // Обновляем статус всех агентов параллельно
      const results = await Promise.allSettled(
        agentIds.map((agentId) =>
          updateAgentStatus(session.user.orgId, agentId, { isActive })
        )
      )

      // Подсчитываем успешные обновления
      updated = results.filter((result) => result.status === 'fulfilled').length

      // Логируем операцию
      const { ActivityLogger } = await import('@/lib/services/activity-logger')
      await ActivityLogger.bulkAgentsUpdated(
        session.user.orgId,
        session.user.id,
        agentIds,
        action
      ).catch((error) => {
        console.error('Failed to log bulk update:', error)
      })
    } else if (action === 'delete') {
      // Удаление агентов будет обрабатываться отдельно через существующий endpoint
      // Здесь просто возвращаем ошибку
      return NextResponse.json(
        {
          success: false,
          error: 'Для удаления используйте DELETE метод для каждого агента',
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      updated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'BULK_UPDATE_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}
