import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import {
  getKnowledgeBaseCategoryById,
  updateKnowledgeBaseCategory,
  deleteKnowledgeBaseCategory,
} from '@/lib/repositories/knowledge-base'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const category = await getKnowledgeBaseCategoryById(id, session.user.orgId)

    if (!category) {
      return NextResponse.json({ success: false, error: 'Категория не найдена' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Category API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить категорию',
      },
      { status: 500 },
    )
  }
}

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
})

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = updateCategorySchema.safeParse(body)

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

    const category = await updateKnowledgeBaseCategory(id, session.user.orgId, parsed.data)

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Category update API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить категорию',
      },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    await deleteKnowledgeBaseCategory(id, session.user.orgId)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Category delete API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить категорию',
      },
      { status: 500 },
    )
  }
}
















