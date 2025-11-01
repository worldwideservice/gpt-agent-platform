import { NextResponse } from 'next/server'
import { KommoAPI } from '@/lib/crm/kommo'
import { evaluateKommoTestConfig } from '@/lib/env/kommo-test'

// API routes should always be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = async () => {
  const state = evaluateKommoTestConfig()

  if (!state.enabled) {
    const { message, missing, status } = state
    return NextResponse.json(
      {
        success: false,
        error: message,
        ...(missing ? { missing } : {}),
        ...(status === 503
          ? { details: 'Set KOMMO_TEST_ENABLED=1 in the environment to enable manual testing.' }
          : {}),
      },
      { status },
    )
  }

  const kommoApi = new KommoAPI(state.config)

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Running Kommo API connectivity test...')
      console.log('🔧 API URL:', kommoApi.getBaseUrl())
    }

    const [users, pipelines, stats] = await Promise.all([
      kommoApi.getUsers(),
      kommoApi.getPipelines(),
      kommoApi.getLeadsStats(),
    ])

    return NextResponse.json({
      success: true,
      message: 'Kommo API test completed successfully.',
      data: {
        usersCount: users.length,
        pipelinesCount: pipelines.length,
        stats,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Kommo API test failed:', errorMessage)
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
