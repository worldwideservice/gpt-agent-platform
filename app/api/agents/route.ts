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
    const { agents, total } = await getAgents({
      organizationId: session.user.orgId,
      search: parsedParams.data.search,
      status: parsedParams.data.status,
      page: parsedParams.data.page,
      limit: parsedParams.data.limit,
    })

    return NextResponse.json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: parsedParams.data.page ?? 1,
        limit: parsedParams.data.limit ?? 25,
      },
    })
  } catch (error) {
    console.error('Agents API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить агентов',
      },
      { status: 500 },
    )
  }
}

