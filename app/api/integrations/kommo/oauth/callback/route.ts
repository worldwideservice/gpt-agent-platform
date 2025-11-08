import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const querySchema = z.object({
 code: z.string().min(1),
 state: z.string().min(1),
 error: z.string().nullable().optional(),
 error_description: z.string().nullable().optional(),
})

export async function GET(request: NextRequest) {
 try {
 const { searchParams } = new URL(request.url)
 const query = querySchema.parse({
 code: searchParams.get('code'),
 state: searchParams.get('state'),
 error: searchParams.get('error'),
 error_description: searchParams.get('error_description'),
 })

 // Если есть ошибка от Kommo
 if (query.error) {
 console.error('Kommo OAuth error:', query.error, query.error_description)
 return NextResponse.json({
 success: false,
 error: query.error,
 description: query.error_description,
 }, { status: 400 })
 }

 // Если нет кода - ошибка
 if (!query.code) {
 return NextResponse.json({
 success: false,
 error: 'Authorization code not provided',
 }, { status: 400 })
 }

 console.log('Processing Kommo OAuth callback:', {
 code: query.code.substring(0, 10) + '...',
 state: query.state,
 })

 // Обмениваем authorization code на токены напрямую через Kommo API
 const clientId = process.env.KOMMO_CLIENT_ID
 const clientSecret = process.env.KOMMO_CLIENT_SECRET
 const redirectUri = process.env.KOMMO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations/kommo/oauth/callback`

 if (!clientId || !clientSecret) {
 return NextResponse.json({
 success: false,
 error: 'Kommo OAuth credentials not configured',
 }, { status: 500 })
 }

 const tokenResponse = await fetch('https://kommo.com/oauth2/access_token', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded',
 },
 body: new URLSearchParams({
 client_id: clientId,
 client_secret: clientSecret,
 grant_type: 'authorization_code',
 code: query.code,
 redirect_uri: redirectUri,
 }),
 })

 const tokens = await tokenResponse.json()

 if (tokenResponse.ok && tokens.access_token) {
 console.log('Tokens received successfully')

 // Возвращаем токены в JSON формате для обработки на frontend
 return NextResponse.json({
 success: true,
 access_token: tokens.access_token,
 refresh_token: tokens.refresh_token,
 expires_in: tokens.expires_in,
 token_type: tokens.token_type,
 base_domain: tokens.base_domain,
 account_id: tokens.account_id,
 })
 } else {
 console.error('Token exchange failed:', tokens)
 return NextResponse.json({
 success: false,
 error: tokens.error_description || tokens.error || 'Token exchange failed',
 }, { status: 400 })
 }

 } catch (error) {
 console.error('Kommo OAuth callback processing error:', error)

 return NextResponse.json({
 success: false,
 error: error instanceof z.ZodError ? 'Invalid request parameters' : 'Internal server error',
 }, { status: error instanceof z.ZodError ? 400 : 500 })
 }
}
