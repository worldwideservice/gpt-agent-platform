import { NextRequest, NextResponse } from 'next/server'

import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
 // Простой тест входа для founder@example.com
 const testEmail = 'founder@example.com'
 const testPassword = 'Demo1234!'

 try {
 // Имитируем успешный вход
 const mockUser = {
 id: '00000000-0000-4000-8000-0000000000ff',
 email: testEmail,
 name: 'Demo Founder',
 orgId: process.env.SUPABASE_DEFAULT_ORGANIZATION_ID || '550e8400-e29b-41d4-a716-446655440000'
 }

 logger.log('Test login successful for:', testEmail)

 return NextResponse.json({
 success: true,
 user: mockUser,
 message: 'Test login successful'
 })
 } catch (error: unknown) {
 logger.error('Test login error:', error, {
   endpoint: '/api/test-login',
   method: 'GET',
 })
 return NextResponse.json({
 success: false,
 error: 'Test login failed'
 }, { status: 500 })
 }
}
