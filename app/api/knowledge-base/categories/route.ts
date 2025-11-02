import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import {
  getKnowledgeBaseCategories,
  createKnowledgeBaseCategory,
} from '@/lib/repositories/knowledge-base'

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const categories = await getKnowledgeBaseCategories(session.user.orgId)

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Categories API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить категории',
      },
      { status: 500 },
    )
  }
}

const createCategorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
})

export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)

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

    const category = await createKnowledgeBaseCategory(session.user.orgId, parsed.data)

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Category create API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать категорию',
      },
      { status: 500 },
    )
  }
}
















