import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Генерация Secret Key и Integration ID
export async function POST(request: NextRequest) {
  try {
    const { crmType } = await request.json()

    // Генерируем Secret Key (32 байта в hex)
    const secretKey = randomBytes(32).toString('hex')
    
    // Генерируем Integration ID (UUID v4 формат)
    const integrationId = generateUUID()

    return NextResponse.json({
      success: true,
      secretKey,
      integrationId
    })

  } catch (error) {
    console.error('Error generating secret key:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate secret key' },
      { status: 500 }
    )
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
