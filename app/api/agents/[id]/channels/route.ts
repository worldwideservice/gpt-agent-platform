import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { logger } from '@/lib/utils/logger'
import { getAgentById } from '@/lib/repositories/agents'
import {

  getAgentChannels,
  upsertAgentChannel,
} from '@/lib/repositories/agent-sequences'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const updateChannelsSchema = z.object({
  allChannelsEnabled: z.boolean(),
  channels: z
    .array(
      z.object({
        id: z.string(),
        isActive: z.boolean(),
      }),
    )
    .optional(),
})

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const channels = await getAgentChannels(session.user.orgId, id)

    return NextResponse.json({
      success: true,
      data: channels,
    })
  } catch (error: unknown) {
    logger.error('Agent channels GET error', error, {
      endpoint: '/api/agents/[id]/channels',
      method: 'GET',
      agentId: id,
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить каналы',
      },
      { status: 500 },
    )
  }
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: agentId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const agent = await getAgentById(agentId, session.user.orgId)
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
    }

    const body = await request.json().catch(() => null)
    const parsed = updateChannelsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Некорректные данные',
          details: parsed.error.issues,
        },
        { status: 400 },
      )
    }

    const { allChannelsEnabled, channels } = parsed.data
    const supabase = getSupabaseServiceRoleClient()

    await supabase
      .from('agent_channels')
      .delete()
      .eq('org_id', session.user.orgId)
      .eq('agent_id', agentId)

    if (!allChannelsEnabled && Array.isArray(channels)) {
      const operations = channels.map((channel) =>
        upsertAgentChannel(session.user.orgId, agentId, channel.id, {
          isEnabled: channel.isActive,
        }),
      )

      await Promise.all(operations)
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error('Agent channels POST error', error, {
      endpoint: '/api/agents/[id]/channels',
      method: 'POST',
      agentId,
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось сохранить настройки каналов',
      },
      { status: 500 },
    )
  }
}
















