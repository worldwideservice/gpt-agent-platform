/**
 * Репозиторий для работы с диалогами и сообщениями
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

export interface ChatMessage {
 id: string
 conversationId: string
 role: 'user' | 'assistant' | 'system'
 content: string
 metadata?: Record<string, unknown>
 createdAt: string
}

export interface Conversation {
 id: string
 organizationId: string
 agentId: string | null
 userId: string | null
 leadId?: number | null // ID сделки в Kommo CRM
 title: string | null
 metadata?: Record<string, unknown>
 createdAt: string
 updatedAt: string
}

/**
 * Создает новый диалог
 */
export const createConversation = async (
 organizationId: string,
 data: {
 agentId?: string | null
 userId?: string | null
 leadId?: number | null
 title?: string | null
 },
): Promise<Conversation> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: conversation, error } = await supabase
 .from('agent_conversations')
 .insert({
 org_id: organizationId,
 agent_id: data.agentId ?? null,
 user_id: data.userId ?? null,
 lead_id: data.leadId ?? null,
 title: data.title ?? null,
 })
 .select('*')
 .single()

 if (error) {
 logger.error('Failed to create conversation', error)
 throw new Error('Не удалось создать диалог')
 }

 return {
 id: conversation.id,
 organizationId: conversation.org_id,
 agentId: conversation.agent_id,
 userId: conversation.user_id,
 leadId: conversation.lead_id,
 title: conversation.title,
 metadata: (conversation.metadata as Record<string, unknown>) ?? {},
 createdAt: conversation.created_at,
 updatedAt: conversation.updated_at,
 }
}

/**
 * Получает список диалогов для организации
 */
export const getConversations = async (
 organizationId: string,
 options: {
 agentId?: string | null
 userId?: string | null
 limit?: number
 offset?: number
 } = {},
): Promise<{ conversations: Conversation[]; total: number }> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('agent_conversations')
 .select('*', { count: 'exact' })
 .eq('org_id', organizationId)
 .order('updated_at', { ascending: false })

 if (options.agentId) {
 query = query.eq('agent_id', options.agentId)
 }

 if (options.userId) {
 query = query.eq('user_id', options.userId)
 }

 if (options.limit) {
 query = query.limit(options.limit)
 }

 if (options.offset) {
 query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1)
 }

 const { data, count, error } = await query

 if (error) {
 logger.error('Failed to fetch conversations', error)
 return { conversations: [], total: 0 }
 }

 const conversations =
 data?.map((row) => ({
 id: row.id,
 organizationId: row.org_id,
 agentId: row.agent_id,
 userId: row.user_id,
 title: row.title,
 metadata: (row.metadata as Record<string, unknown>) ?? {},
 createdAt: row.created_at,
 updatedAt: row.updated_at,
 })) ?? []

 return {
 conversations,
 total: count ?? conversations.length,
 }
}

/**
 * Получает диалог по ID
 */
export const getConversationById = async (
 conversationId: string,
 organizationId: string,
): Promise<Conversation | null> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_conversations')
 .select('*')
 .eq('id', conversationId)
 .eq('org_id', organizationId)
 .maybeSingle()

 if (error) {
 logger.error('Failed to fetch conversation', error)
 return null
 }

 if (!data) {
 return null
 }

 return {
 id: data.id,
 organizationId: data.org_id,
 agentId: data.agent_id,
 userId: data.user_id,
 title: data.title,
 metadata: (data.metadata as Record<string, unknown>) ?? {},
 createdAt: data.created_at,
 updatedAt: data.updated_at,
 }
}

/**
 * Добавляет сообщение в диалог
 */
export const addMessageToConversation = async (
 conversationId: string,
 message: {
 role: 'user' | 'assistant' | 'system'
 content: string
 metadata?: Record<string, unknown>
 },
): Promise<ChatMessage> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('message_logs')
 .insert({
 conversation_id: conversationId,
 role: message.role,
 content: message.content,
 metadata: message.metadata ?? {},
 })
 .select('*')
 .single()

 if (error) {
 logger.error('Failed to add message', error)
 throw new Error('Не удалось сохранить сообщение')
 }

 // Обновляем updated_at диалога
 await supabase
 .from('agent_conversations')
 .update({ updated_at: new Date().toISOString() })
 .eq('id', conversationId)

 return {
 id: data.id,
 conversationId: data.conversation_id,
 role: data.role as 'user' | 'assistant' | 'system',
 content: data.content,
 metadata: (data.metadata as Record<string, unknown>) ?? {},
 createdAt: data.created_at,
 }
}

/**
 * Получает историю сообщений диалога
 */
export const getConversationMessages = async (
 conversationId: string,
 options: {
 limit?: number
 offset?: number
 } = {},
): Promise<ChatMessage[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('message_logs')
 .select('*')
 .eq('conversation_id', conversationId)
 .order('created_at', { ascending: true })

 if (options.limit) {
 query = query.limit(options.limit)
 }

 if (options.offset) {
 query = query.range(options.offset, options.offset + (options.limit ?? 100) - 1)
 }

 const { data, error } = await query

 if (error) {
 logger.error('Failed to fetch messages', error)
 return []
 }

 return (
 data?.map((row) => ({
 id: row.id,
 conversationId: row.conversation_id,
 role: row.role as 'user' | 'assistant' | 'system',
 content: row.content,
 metadata: (row.metadata as Record<string, unknown>) ?? {},
 createdAt: row.created_at,
 })) ?? []
 )
}









