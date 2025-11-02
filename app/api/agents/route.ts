import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgents } from '@/lib/repositories/agents'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number.parseInt(value, 10))
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number.parseInt(value, 10))
    .optional(),
})

import { createAgent } from '@/lib/repositories/agents'

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: Получение списка ИИ-агентов
 *     description: Возвращает список ИИ-агентов организации с поддержкой фильтрации и пагинации
 *     tags:
 *       - Agents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по имени или описанию агента
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, draft]
 *         description: Фильтр по статусу агента
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номер страницы (начиная с 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Количество агентов на странице
 *     responses:
 *       200:
 *         description: Успешный ответ со списком агентов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         description: Имя агента
 *                       description:
 *                         type: string
 *                         description: Описание агента
 *                       instructions:
 *                         type: string
 *                         description: Основные инструкции для агента
 *                       model:
 *                         type: string
 *                         description: Модель ИИ (gpt-4, gpt-3.5-turbo и т.д.)
 *                       status:
 *                         type: string
 *                         enum: [active, inactive, draft]
 *                       welcomeMessage:
 *                         type: string
 *                         description: Приветственное сообщение
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Общее количество агентов
 *                 page:
 *                   type: integer
 *                   description: Текущая страница
 *                 limit:
 *                   type: integer
 *                   description: Количество агентов на странице
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 *   post:
 *     summary: Создание нового ИИ-агента
 *     description: Создает нового ИИ-агента с указанными параметрами
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
 *               - name
 *               - instructions
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Имя агента
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Описание агента
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 description: Основные инструкции для агента
 *               model:
 *                 type: string
 *                 default: "gpt-4"
 *                 description: Модель ИИ
 *               welcomeMessage:
 *                 type: string
 *                 description: Приветственное сообщение
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *                 default: "draft"
 *                 description: Статус агента
 *             example:
 *               name: "Менеджер по продажам"
 *               description: "Агент для обработки запросов клиентов"
 *               instructions: "Вы - профессиональный менеджер по продажам. Будьте вежливы, информативны и помогайте клиентам."
 *               model: "gpt-4"
 *               welcomeMessage: "Здравствуйте! Чем я могу вам помочь?"
 *               status: "active"
 *     responses:
 *       201:
 *         description: Агент успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 agent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     instructions:
 *                       type: string
 *                     model:
 *                       type: string
 *                     status:
 *                       type: string
 *                     welcomeMessage:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Неверные входные данные
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const parsedParams = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsedParams.success) {
    const issues = parsedParams.error.issues.map((issue) => issue.message)
    return NextResponse.json(
      {
        success: false,
        error: 'Некорректные параметры запроса',
        details: issues,
      },
      { status: 400 },
    )
  }

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const result = await getAgents({
      organizationId: session.user.orgId,
      page: parsedParams.data.page,
      limit: parsedParams.data.limit,
      search: parsedParams.data.search,
      status: parsedParams.data.status,
    })

    return NextResponse.json({
      success: true,
      data: result.agents,
      pagination: {
        total: result.total,
        page: parsedParams.data.page,
        limit: parsedParams.data.limit,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить агентов',
      },
      { status: 500 },
    )
  }
}

const settingsSchema = z
  .object({
    language: z.string().optional(),
    welcomeMessage: z.string().optional(),
    description: z.string().optional(),
    presencePenalty: z.number().min(-2).max(2).optional(),
    frequencyPenalty: z.number().min(-2).max(2).optional(),
    defaultChannels: z.array(z.string()).optional(),
    knowledgeBaseAllCategories: z.boolean().optional(),
    createTaskOnNotFound: z.boolean().optional(),
    notFoundMessage: z.string().optional(),
  })
  .optional()

const createAgentSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  model: z.string().optional(),
  instructions: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(128).max(8000).optional(),
  responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
  settings: settingsSchema,
})

export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createAgentSchema.safeParse(body)

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

    const agent = await createAgent(session.user.orgId, {
      name: parsed.data.name,
      status: parsed.data.status,
      model: parsed.data.model,
      instructions: parsed.data.instructions,
      temperature: parsed.data.temperature,
      maxTokens: parsed.data.maxTokens,
      responseDelaySeconds: parsed.data.responseDelaySeconds,
      settings: parsed.data.settings ?? {},
    })

    return NextResponse.json({
      success: true,
      data: agent,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать агента',
      },
      { status: 500 },
    )
  }
}

