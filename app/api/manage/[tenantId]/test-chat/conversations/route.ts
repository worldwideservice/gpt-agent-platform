// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'
import { validateRequest } from '@/lib/validation/validate'
import { createTestConversationSchema } from '@/lib/validation/schemas/test-chat'
import { rateLimitAPI } from '@/lib/middleware/rate-limit-api'

/**
 * GET /api/manage/[tenantId]/test-chat/conversations
 *
 * Возвращает список тестовых бесед пользователя
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies ограничивают доступ к собственным беседам
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params

  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResponse = await rateLimitAPI(request, session.user.id)
    if (rateLimitResponse) return rateLimitResponse

    const userId = session.user.id
    const { tenantId } = params

    // 2. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat GET conversations: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 3. Получаем список бесед пользователя
    const { data: conversations, error: conversationsError } = await supabase
      .from('test_conversations')
      .select(`
        id,
        title,
        agent_id,
        created_at,
        updated_at,
        agents (
          id,
          name,
          model
        )
      `)
      .eq('org_id', orgId)
      .eq('created_by', userId)
      .order('updated_at', { ascending: false })

    if (conversationsError) {
      logger.error(
        'Test Chat GET conversations: Failed to fetch conversations',
        conversationsError,
        {
          endpoint: `/api/manage/${tenantId}/test-chat/conversations`,
          tenantId,
          userId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversations: conversations || [],
      count: conversations?.length || 0,
    })
  } catch (error: unknown) {
    logger.error('Test Chat GET conversations: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/conversations`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/manage/[tenantId]/test-chat/conversations
 *
 * Создает новую тестовую беседу
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies проверяют доступ при создании
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId } = params

    // 2. Валидация входных данных
    const { data, error: validationError } = await validateRequest(
      request,
      createTestConversationSchema
    )
    if (validationError) {
      return validationError
    }

    // 3. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat POST conversation: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 4. Если указан agentId, проверяем что агент существует и принадлежит организации
    if (data.agentId) {
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('id', data.agentId)
        .eq('org_id', orgId)
        .single()

      if (agentError || !agent) {
        return NextResponse.json(
          { error: 'Agent not found or does not belong to this organization' },
          { status: 404 }
        )
      }
    }

    // 5. Создаем новую беседу
    const { data: newConversation, error: createError } = await supabase
      .from('test_conversations')
      .insert({
        org_id: orgId,
        created_by: userId,
        agent_id: data.agentId || null,
        title: data.title || 'New Test Chat',
      })
      .select(`
        id,
        title,
        agent_id,
        created_at,
        updated_at,
        agents (
          id,
          name,
          model
        )
      `)
      .single()

    if (createError) {
      logger.error(
        'Test Chat POST conversation: Failed to create conversation',
        createError,
        {
          endpoint: `/api/manage/${tenantId}/test-chat/conversations`,
          tenantId,
          userId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        conversation: newConversation,
        message: 'Conversation created successfully',
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    logger.error('Test Chat POST conversation: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/conversations`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
