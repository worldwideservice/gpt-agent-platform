import { NextResponse, type NextRequest } from 'next/server'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAgentById } from '@/lib/repositories/agents'

/**
 * POST /api/agents/[id]/assets - Загрузка файла для агента
 */
export const POST = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 // Проверяем, что агент существует и принадлежит организации
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const formData = await request.formData()
 const file = formData.get('file') as File | null

 if (!file) {
 return NextResponse.json({ success: false, error: 'Файл не предоставлен' }, { status: 400 })
 }

 // Ограничение размера файла (50 MB)
 const maxSize = 50 * 1024 * 1024
 if (file.size > maxSize) {
 return NextResponse.json(
 { success: false, error: 'Размер файла не должен превышать 50 MB' },
 { status: 400 },
 )
 }

 // Поддерживаемые типы файлов
 const allowedTypes = [
 'application/pdf',
 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'text/plain',
 'text/html',
 'text/markdown',
 ]

 if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt|html|md)$/i)) {
 return NextResponse.json(
 {
 success: false,
 error: 'Неподдерживаемый тип файла. Поддерживаются: PDF, DOCX, TXT, HTML, Markdown',
 },
 { status: 400 },
 )
 }

 // Загружаем файл в Supabase Storage
 const supabaseClient = getSupabaseServerClient()
 const storagePath = `agents/${session.user.orgId}/${agentId}/${Date.now()}-${file.name}`

 const fileBuffer = await file.arrayBuffer()
 const { data: uploadData, error: uploadError } = await supabaseClient.storage
 .from('agent-assets')
 .upload(storagePath, fileBuffer, {
 contentType: file.type,
 upsert: false,
 })

 if (uploadError) {
 console.error('Failed to upload file to storage', uploadError)
 return NextResponse.json(
 { success: false, error: 'Не удалось загрузить файл' },
 { status: 500 },
 )
 }

 // Создаем запись в agent_assets
 const supabase = getSupabaseServiceRoleClient()
 const { data: assetData, error: assetError } = await supabase
 .from('agent_assets')
 .insert({
 agent_id: agentId,
 org_id: session.user.orgId,
 type: 'file',
 source_name: file.name,
 storage_path: storagePath,
 file_size: file.size,
 mime_type: file.type,
 status: 'pending',
 })
 .select('*')
 .single()

 if (assetError || !assetData) {
 console.error('Failed to create asset record', assetError)
 
 // Удаляем загруженный файл если не удалось создать запись
 await supabaseClient.storage.from('agent-assets').remove([storagePath])
 
 return NextResponse.json(
 { success: false, error: 'Не удалось сохранить информацию о файле' },
 { status: 500 },
 )
 }

 // Добавляем задачу в очередь для обработки файла (через backend API)
 try {
 const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:4000'
 await fetch(`${backendUrl}/jobs`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 type: 'process-asset',
 assetId: assetData.id,
 organizationId: session.user.orgId,
 }),
 })
 } catch (queueError) {
 // Логируем ошибку, но не прерываем загрузку файла
 console.error('Failed to queue asset processing job', queueError)
 // Можно отправить уведомление пользователю или обработать позже
 }

 return NextResponse.json({
 success: true,
 data: {
 id: assetData.id,
 name: file.name,
 size: file.size,
 type: file.type,
 status: 'pending',
 },
 })
 } catch (error) {
 console.error('Asset upload API error', error)

 const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить файл',
 details: errorMessage,
 },
 { status: 500 },
 )
 }
}

/**
 * GET /api/agents/[id]/assets - Получение списка файлов агента
 */
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 // Проверяем, что агент существует
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const supabase = getSupabaseServiceRoleClient()
 const { data: assets, error } = await supabase
 .from('agent_assets')
 .select('*')
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)
 .order('created_at', { ascending: false })

 if (error) {
 console.error('Failed to fetch assets', error)
 return NextResponse.json(
 { success: false, error: 'Не удалось загрузить файлы' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 data: assets ?? [],
 })
 } catch (error) {
 console.error('Assets GET API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить файлы',
 },
 { status: 500 },
 )
 }
}

