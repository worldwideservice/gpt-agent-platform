// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/manage/[tenantId]/test-chat/conversations/[conversationId]
 *
 * Возвращает все сообщения для конкретной беседы
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies ограничивают доступ к собственным беседам
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; conversationId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId, conversationId } = params

    // 2. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat GET messages: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 3. Проверяем, что беседа существует и принадлежит пользователю
    const { data: conversation, error: conversationError } = await supabase
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
          model,
          instructions
        )
      `)
      .eq('id', conversationId)
      .eq('org_id', orgId)
      .eq('created_by', userId)
      .single()

    if (conversationError || !conversation) {
      logger.error('Test Chat GET messages: Conversation not found', conversationError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}`,
        tenantId,
        conversationId,
        userId,
      })
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      )
    }

    // 4. Получаем сообщения беседы
    const { data: messages, error: messagesError } = await supabase
      .from('test_messages')
      .select('id, role, content, metadata, created_at')
      .eq('conversation_id', conversationId)
      .eq('org_id', orgId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      logger.error('Test Chat GET messages: Failed to fetch messages', messagesError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}`,
        tenantId,
        conversationId,
      })
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversation,
      messages: messages || [],
      messageCount: messages?.length || 0,
    })
  } catch (error: unknown) {
    logger.error('Test Chat GET messages: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/conversations/${params.conversationId}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/manage/[tenantId]/test-chat/conversations/[conversationId]
 *
 * Удаляет тестовую беседу и все её сообщения
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies проверяют права на удаление
 * - Cascade delete удалит все сообщения автоматически
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; conversationId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId, conversationId } = params

    // 2. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat DELETE: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 3. Удаляем беседу (сообщения удалятся автоматически через CASCADE)
    const { error: deleteError } = await supabase
      .from('test_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('org_id', orgId)
      .eq('created_by', userId)

    if (deleteError) {
      logger.error('Test Chat DELETE: Failed to delete conversation', deleteError, {
        endpoint: `/api/manage/${tenantId}/test-chat/conversations/${conversationId}`,
        tenantId,
        conversationId,
        userId,
      })
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
      deletedId: conversationId,
    })
  } catch (error: unknown) {
    logger.error('Test Chat DELETE: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/conversations/${params.conversationId}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
