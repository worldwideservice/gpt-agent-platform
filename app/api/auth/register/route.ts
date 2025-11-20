import { NextRequest, NextResponse } from 'next/server'

import { UserRepository } from '@/lib/repositories/users'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { loadSupabaseServerEnv } from '@/lib/env/supabase'
import { logger } from '@/lib/utils/logger'
import { registerSchema } from '@/lib/validation/schemas/auth'
import { validateRequest } from '@/lib/validation/validate'
import { rateLimitAuth } from '@/lib/middleware/rate-limit-api'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// API routes should always be dynamic

export async function POST(request: NextRequest) {
 try {
 // Apply strict rate limiting for auth endpoints
 const rateLimitResponse = await rateLimitAuth(request)
 if (rateLimitResponse) return rateLimitResponse

 // Validate environment variables
 loadSupabaseServerEnv()

 // 1. Валидация входных данных с помощью Zod
 const { data, error } = await validateRequest(request, registerSchema)
 if (error) {
 return error // Возвращаем ошибку 400, если валидация не пройдена
 }

  // data теперь типизирована и безопасна
  const { email, password, organizationName } = data

 // Check if user already exists
 const existingUser = await UserRepository.findUserByEmail(email)
 if (existingUser) {
 return NextResponse.json(
 { error: 'Пользователь с таким email уже существует' },
 { status: 409 }
 )
 }

  // Create user
  let user
  try {
    user = await UserRepository.createUser({
      email,
      password,
    })

 if (!user) {
 logger.error('Registration: createUser returned null', undefined, {
   endpoint: '/api/auth/register',
   email,
 })
 return NextResponse.json(
   { error: 'Не удалось создать пользователя' },
   { status: 500 }
 )
 }
 } catch (createError: unknown) {
 logger.error('Registration: Error in createUser:', createError, {
   endpoint: '/api/auth/register',
   email,
 })
 const errorMessage = createError instanceof Error ? createError.message : 'Неизвестная ошибка при создании пользователя'
 return NextResponse.json(
 { error: errorMessage },
 { status: 500 }
 )
 }

 let organizationId: string | null = null

 // Create organization for the user
 try {
 logger.info('Registration: Creating organization for user:', { userId: user.id })

 // Use validated Supabase client
 const client = getSupabaseServiceRoleClient()

    // Generate slug from email (username part) or use timestamp
    const emailUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const baseSlug = emailUsername || `org-${Date.now()}`
 let slugCandidate = baseSlug
 let counter = 0

 // Simple slug uniqueness check
 while (counter < 10) {
 try {
 const { data: existing } = await client
 .from('organizations')
 .select('id')
 .eq('slug', slugCandidate)
 .single()

 if (existing) {
 slugCandidate = `${baseSlug}-${counter + 1}`
 counter++
 } else {
 break
 }
 } catch (error) {
 // If no existing org found, slug is unique
 break
 }
 }

    // Используем переданное имя организации или email
    const orgName = organizationName?.trim() || email.split('@')[0]

 const { data: organization, error: orgError } = await client
 .from('organizations')
 .insert({
 name: orgName,
 slug: slugCandidate
 })
 .select()
 .single()

 if (organization && !orgError) {
 organizationId = organization.id

 // Update user's default organization
 const { error: updateError } = await client
 .from('users')
 .update({ default_org_id: organization.id })
 .eq('id', user.id)

 if (updateError) {
 logger.error('Registration: Failed to update user default organization:', updateError, {
   endpoint: '/api/auth/register',
   userId: user.id,
 })
 }

 // Add user to organization
 const { error: memberError } = await client
 .from('organization_members')
 .insert({
 org_id: organization.id,
 user_id: user.id,
 role: 'owner'
 })

 if (memberError) {
 logger.error('Registration: Failed to add user to organization:', memberError, {
   endpoint: '/api/auth/register',
   userId: user.id,
   organizationId: organization.id,
 })
 }


 logger.info('Registration: Organization created successfully:', { organizationId: organization.id })
 } else {
 logger.error('Registration: Failed to create organization:', orgError, {
   endpoint: '/api/auth/register',
   userId: user.id,
 })
 }
 } catch (orgError: unknown) {
 logger.error('Registration: Organization creation failed:', orgError, {
   endpoint: '/api/auth/register',
   userId: user.id,
 })
 // Continue anyway - user is created
 }

 return NextResponse.json({
 success: true,
 message: 'Пользователь успешно зарегистрирован',
 user: {
 id: user.id,
 email: user.email,
 name: user.full_name,
 },
 organizationId,
 })
 } catch (error: unknown) {
 // Логируем ошибки в production тоже для диагностики
 logger.error('Registration error:', error, {
   endpoint: '/api/auth/register',
 })
 if (error instanceof Error) {
 logger.error('Registration error details:', error, {
   endpoint: '/api/auth/register',
   message: error.message,
   stack: error.stack,
 })
 return NextResponse.json(
 { error: error.message },
 { status: 400 }
 )
 }

 return NextResponse.json(
 { error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}
