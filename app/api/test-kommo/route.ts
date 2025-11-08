import { NextResponse } from 'next/server'
import { KommoAPI } from '@/lib/crm/kommo'
import { evaluateKommoTestConfig } from '@/lib/env/kommo-test'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// API routes should always be dynamic

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
 logger.log('🔍 Running Kommo API connectivity test...')
 logger.log('🔧 API URL:', kommoApi.getBaseUrl())

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
 } catch (error: unknown) {
 const errorMessage = error instanceof Error ? error.message : String(error)

 logger.error('❌ Kommo API test failed:', error, {
   endpoint: '/api/test-kommo',
   errorMessage,
 })

 return NextResponse.json(
 {
 success: false,
 error: errorMessage,
 },
 { status: 500 },
 )
 }
}
