import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { z } from 'zod'

// Force dynamic rendering (uses headers from auth())

import { auth } from '@/auth'

import { getKnowledgeBaseArticles, createKnowledgeBaseArticle } from '@/lib/repositories/knowledge-base'

import { createErrorResponse } from '@/lib/utils/error-handler'


const querySchema = z.object({
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(), // Добавляем поддержку поиска
})

export const GET = async (request: NextRequest) => {
 const { searchParams } = new URL(request.url)
 const parsedParams = querySchema.safeParse(Object.fromEntries(searchParams))

 if (!parsedParams.success) {
 const issues = parsedParams.error.issues.map((issue) => issue.message)
 const { response, status } = createErrorResponse(
   new Error('Некорректные параметры запроса'),
   {
     code: 'VALIDATION_ERROR',
     details: issues,
     logToSentry: false,
   }
 )
 return NextResponse.json(response, { status })
 }

 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

  try {
    const articles = await getKnowledgeBaseArticles(
      session.user.orgId,
      parsedParams.data.categoryId,
      parsedParams.data.search,
    )

    return NextResponse.json({
      success: true,
      data: articles,
      timestamp: new Date().toISOString(),
    })
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'ARTICLES_LIST_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
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
 const { response, status } = createErrorResponse(
   new Error('Некорректные данные'),
   {
     code: 'VALIDATION_ERROR',
     details: issues,
     logToSentry: false,
   }
 )
 return NextResponse.json(response, { status })
 }

 const article = await createKnowledgeBaseArticle(session.user.orgId, parsed.data)

 return NextResponse.json({
 success: true,
 data: article,
 timestamp: new Date().toISOString(),
 })
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'ARTICLE_CREATE_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
 }
}















