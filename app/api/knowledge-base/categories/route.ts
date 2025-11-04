import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import {
 getKnowledgeBaseCategories,
 createKnowledgeBaseCategory,
} from '@/lib/repositories/knowledge-base'
import { createErrorResponse } from '@/lib/utils/error-handler'

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
 timestamp: new Date().toISOString(),
 })
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'CATEGORIES_LIST_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
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

 const category = await createKnowledgeBaseCategory(session.user.orgId, parsed.data)

 return NextResponse.json({
 success: true,
 data: category,
 timestamp: new Date().toISOString(),
 })
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'CATEGORY_CREATE_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
 }
}




















