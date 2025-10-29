import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getAgentById } from '@/lib/repositories/agents'

/**
 * DELETE /api/agents/[id]/assets/[assetId] - Удаление файла агента
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> },
) => {
  const { id: agentId, assetId } = await params
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

    // Получаем информацию о файле
    const { data: asset, error: fetchError } = await supabase
      .from('agent_assets')
      .select('storage_path')
      .eq('id', assetId)
      .eq('agent_id', agentId)
      .eq('org_id', session.user.orgId)
      .single()

    if (fetchError || !asset) {
      return NextResponse.json({ success: false, error: 'Файл не найден' }, { status: 404 })
    }

    // Удаляем файл из Storage
    if (asset.storage_path) {
      const supabaseClient = getSupabaseServerClient()
      await supabaseClient.storage.from('agent-assets').remove([asset.storage_path])
    }

    // Удаляем запись из БД (chunks удалятся каскадно)
    const { error: deleteError } = await supabase
      .from('agent_assets')
      .delete()
      .eq('id', assetId)
      .eq('agent_id', agentId)
      .eq('org_id', session.user.orgId)

    if (deleteError) {
      console.error('Failed to delete asset', deleteError)
      return NextResponse.json(
        { success: false, error: 'Не удалось удалить файл' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Asset delete API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить файл',
      },
      { status: 500 },
    )
  }
}


