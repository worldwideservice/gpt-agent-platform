import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { backendFetch } from '@/lib/backend/client'
import { getOrganizationById } from '@/lib/repositories/organizations'
import { trackIntegrationConnected } from '@/lib/analytics/examples'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const querySchema = z.object({
 code: z.string().min(1),
 state: z.string().min(1),
 error: z.string().optional(),
 error_description: z.string().optional(),
})

type BackendOAuthResponse = {
 success: boolean
 connection?: {
 org_id: string
 base_domain: string
 status?: string
 }
 error?: string
 description?: string
}

export async function GET(request: NextRequest) {
 const { searchParams } = new URL(request.url)
 const query = querySchema.parse({
 code: searchParams.get('code'),
 state: searchParams.get('state'),
 error: searchParams.get('error'),
 error_description: searchParams.get('error_description'),
 })

 if (query.error) {
 console.error('Kommo OAuth error:', query.error, query.error_description)
 return NextResponse.json(
 {
 success: false,
 error: query.error,
 description: query.error_description,
 },
 { status: 400 },
 )
 }

 try {
 const backendResult = await backendFetch<BackendOAuthResponse>('/kommo/oauth/callback', {
 method: 'POST',
 body: JSON.stringify({
 code: query.code,
 state: query.state,
 provider: 'kommo',
 }),
 })

 if (backendResult.success && backendResult.connection?.org_id) {
 const organization = await getOrganizationById(backendResult.connection.org_id)

 // Track integration connected for analytics
 try {
 trackIntegrationConnected({
 integrationType: 'kommo',
 organizationId: backendResult.connection.org_id,
 userId: backendResult.connection.org_id, // Using org_id as fallback
 })
 } catch (analyticsError) {
 console.error('Failed to track integration connected', analyticsError)
 }

 if (organization?.slug) {
 const origin = new URL(request.url).origin
 const redirectUrl = new URL(`/manage/${organization.slug}/integrations`, origin)
 redirectUrl.searchParams.set('provider', 'kommo')
 redirectUrl.searchParams.set('status', 'success')
 return NextResponse.redirect(redirectUrl)
 }
 }

 return NextResponse.json(backendResult)
 } catch (error) {
 console.error('Kommo OAuth callback processing error:', error)
 return NextResponse.json(
 {
 success: false,
 error: error instanceof Error ? error.message : 'Internal server error',
 },
 { status: 500 },
 )
 }
}
