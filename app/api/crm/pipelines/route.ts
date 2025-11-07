import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

type PipelineRow = {
  id: string
  connection_id: string
  external_id: string
  name: string
  is_active: boolean | null
  sort_order: number | null
  metadata: Record<string, unknown> | null
}

type StageRow = {
  id: string
  pipeline_id: string
  external_id: string
  name: string
  sort_order: number | null
  metadata: Record<string, unknown> | null
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { data: connections, error: connectionsError } = await supabase
      .from('crm_connections')
      .select('id, provider, base_domain, metadata')
      .eq('org_id', session.user.orgId)

    if (connectionsError) {
      console.error('[crm/pipelines] Failed to load connections', connectionsError)
      throw new Error('Не удалось загрузить подключения CRM')
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          pipelines: [],
          stages: [],
        },
      })
    }

    const connectionIds = connections.map((connection) => connection.id)

    const { data: pipelines, error: pipelinesError } = await supabase
      .from('crm_pipelines')
      .select('id, connection_id, external_id, name, is_active, sort_order, metadata')
      .in('connection_id', connectionIds)
      .order('sort_order', { ascending: true })

    if (pipelinesError) {
      console.error('[crm/pipelines] Failed to load pipelines', pipelinesError)
      throw new Error('Не удалось загрузить воронки CRM')
    }

    const pipelineIds = (pipelines as PipelineRow[] | null)?.map((pipeline) => pipeline.id) ?? []

    let stages: StageRow[] = []

    if (pipelineIds.length > 0) {
      const { data: stagesData, error: stagesError } = await supabase
        .from('crm_pipeline_stages')
        .select('id, pipeline_id, external_id, name, sort_order, metadata')
        .in('pipeline_id', pipelineIds)
        .order('sort_order', { ascending: true })

      if (stagesError) {
        console.error('[crm/pipelines] Failed to load stages', stagesError)
        throw new Error('Не удалось загрузить этапы воронок')
      }

      stages = (stagesData as StageRow[] | null) ?? []
    }

    return NextResponse.json({
      success: true,
      data: {
        pipelines: (pipelines as PipelineRow[] | null) ?? [],
        stages,
        connections,
      },
    })
  } catch (error) {
    console.error('[crm/pipelines] Unexpected error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные CRM',
      },
      { status: 500 },
    )
  }
}

