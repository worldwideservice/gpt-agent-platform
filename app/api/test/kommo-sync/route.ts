// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  if (process.env.E2E_ONBOARDING_FAKE !== '1') {
    return NextResponse.json({ success: false, error: 'Available only in E2E mode' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    return NextResponse.json({
      success: true,
      message: 'Mocked Kommo sync executed',
      payload: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Mocked Kommo sync failed', error)
    return NextResponse.json({ success: false, error: 'Mock sync failed' }, { status: 500 })
  }
}
