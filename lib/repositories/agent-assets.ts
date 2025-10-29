/**
 * Репозиторий для работы с файлами агентов (agent_assets)
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { AgentAssetRow } from '@/types/supabase'

export interface AgentAsset {
  id: string
  agentId: string
  orgId: string
  type: string
  sourceName: string
  storagePath: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error: string | null
  fileSize: number | null
  mimeType: string | null
  chunksCount: number
  processingError: string | null
  createdAt: string
  processedAt: string | null
}

const mapAssetRowToDomain = (row: AgentAssetRow): AgentAsset => {
  return {
    id: row.id,
    agentId: row.agent_id,
    orgId: row.org_id,
    type: row.type,
    sourceName: row.source_name ?? '',
    storagePath: row.storage_path,
    status: (row.status as AgentAsset['status']) ?? 'pending',
    error: row.error,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    chunksCount: row.chunks_count ?? 0,
    processingError: row.processing_error,
    createdAt: row.created_at,
    processedAt: row.processed_at,
  }
}

export const getAgentAssets = async (
  organizationId: string,
  agentId: string,
): Promise<AgentAsset[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_assets')
    .select('*')
    .eq('org_id', organizationId)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch agent assets', error)
    throw new Error('Не удалось загрузить файлы агента')
  }

  return ((data as AgentAssetRow[] | null) ?? []).map(mapAssetRowToDomain)
}

export const getAgentAssetById = async (
  organizationId: string,
  agentId: string,
  assetId: string,
): Promise<AgentAsset | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_assets')
    .select('*')
    .eq('id', assetId)
    .eq('org_id', organizationId)
    .eq('agent_id', agentId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch agent asset', error)
    throw new Error('Не удалось загрузить файл')
  }

  if (!data) {
    return null
  }

  return mapAssetRowToDomain(data as AgentAssetRow)
}

export const updateAssetStatus = async (
  assetId: string,
  status: AgentAsset['status'],
  error?: string | null,
  chunksCount?: number,
  processingError?: string | null,
): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

  const updateData: Partial<AgentAssetRow> = {
    status,
    error: error ?? null,
    processed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
  }

  if (chunksCount !== undefined) {
    updateData.chunks_count = chunksCount
  }

  if (processingError !== undefined) {
    updateData.processing_error = processingError
  }

  const { error: updateError } = await supabase
    .from('agent_assets')
    .update(updateData)
    .eq('id', assetId)

  if (updateError) {
    console.error('Failed to update asset status', updateError)
    throw new Error('Не удалось обновить статус файла')
  }
}

export type { AgentAsset }


