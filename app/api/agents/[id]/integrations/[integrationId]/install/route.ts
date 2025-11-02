import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string; integrationId: string }>
}

// POST - Установка интеграции
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { id: agentId, integrationId } = resolvedParams

    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        { success: false, error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { integration_type } = body

    if (!integration_type) {
      return NextResponse.json(
        { success: false, error: 'Не указан тип интеграции' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServiceRoleClient()

    // Проверяем существует ли уже интеграция
    const { data: existing } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('agent_id', agentId)
      .eq('integration_type', integration_type)
      .eq('org_id', session.user.orgId)
      .single()

    if (existing) {
      // Если уже существует - обновляем статус установки
      const { data: updated, error: updateError } = await supabase
        .from('agent_integrations')
        .update({ is_installed: true })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating integration:', updateError)
        return NextResponse.json(
          { success: false, error: 'Не удалось обновить интеграцию' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        integration: updated,
      })
    }

    // Создаем новую интеграцию
    const { data: newIntegration, error: createError } = await supabase
      .from('agent_integrations')
      .insert({
        agent_id: agentId,
        org_id: session.user.orgId,
        integration_type,
        is_installed: true,
        is_active: false, // По умолчанию неактивна до настройки
        settings: {},
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating integration:', createError)
      return NextResponse.json(
        { success: false, error: 'Не удалось создать интеграцию' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      integration: newIntegration,
    })
  } catch (error) {
    console.error('Agent integration install API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

