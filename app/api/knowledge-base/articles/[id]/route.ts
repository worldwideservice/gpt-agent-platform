import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'


import { auth } from '@/auth'

import {

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
 getKnowledgeBaseArticleById,
 updateKnowledgeBaseArticle,
 deleteKnowledgeBaseArticle,

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
 const article = await getKnowledgeBaseArticleById(id, session.user.orgId)

 if (!article) {
 return NextResponse.json({ success: false, error: 'Статья не найдена' }, { status: 404 })
 }

 return NextResponse.json({
 success: true,
 data: article,
 })
 } catch (error) {
 console.error('Article API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить статью',
 },
 { status: 500 },
 )
 }
}

const updateArticleSchema = z.object({
 title: z.string().min(1).optional(),
 content: z.string().min(1).optional(),
 categoryId: z.string().uuid().nullable().optional(),
 slug: z.string().optional(),
 isPublished: z.boolean().optional(),
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
 const parsed = updateArticleSchema.safeParse(body)

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

 const article = await updateKnowledgeBaseArticle(id, session.user.orgId, parsed.data)

 return NextResponse.json({
 success: true,
 data: article,
 })
 } catch (error) {
 console.error('Article update API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить статью',
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
 await deleteKnowledgeBaseArticle(id, session.user.orgId)

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Article delete API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить статью',
 },
 { status: 500 },
 )
 }
}




































