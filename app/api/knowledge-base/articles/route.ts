import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getKnowledgeBaseArticles, createKnowledgeBaseArticle } from '@/lib/repositories/knowledge-base'

const querySchema = z.object({
  categoryId: z.string().uuid().optional(),
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
    const articles = await getKnowledgeBaseArticles(session.user.orgId, parsedParams.data.categoryId)

    return NextResponse.json({
      success: true,
      data: articles,
    })
  } catch (error) {
    console.error('Articles API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить статьи',
      },
      { status: 500 },
    )
  }
}

const createArticleSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  content: z.string().min(1, 'Содержание обязательно'),
  categoryId: z.string().uuid().nullable().optional(),
  slug: z.string().optional(),
  isPublished: z.boolean().optional(),
})

export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createArticleSchema.safeParse(body)

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

    const article = await createKnowledgeBaseArticle(session.user.orgId, parsed.data)

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Article create API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать статью',
      },
      { status: 500 },
    )
  }
}












