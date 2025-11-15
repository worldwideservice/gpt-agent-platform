import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

const bodySchema = z.object({
  baseDomain: z.string().min(1),
  tenantId: z.string().min(1),
})

interface RouteParams {
  params: Promise<{
    agentId: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { agentId } = resolvedParams
    const body = bodySchema.parse(await request.json())
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    // Вызываем backend OAuth start
    const result = await backendFetch<{ success: boolean; authUrl: string; state: string }>(
      '/kommo/oauth/start',
      {
        method: 'POST',
        body: JSON.stringify({
          orgId: session.user.orgId,
          baseDomain: body.baseDomain,
        }),
      }
    )

    if (result.success && result.authUrl) {
      // Сохраняем agentId и tenantId в cookie для callback
      const cookieStore = await cookies()
      cookieStore.set('kommo_oauth_agent_id', agentId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 минут
      })
      cookieStore.set('kommo_oauth_tenant_id', body.tenantId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Kommo oauth start error:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof z.ZodError
            ? 'Некорректные параметры запроса'
            : 'Не удалось запустить OAuth авторизацию Kommo',
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    )
  }
}
