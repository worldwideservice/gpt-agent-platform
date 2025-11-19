import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

import { backendFetch } from '@/lib/backend/client'
import { getOrganizationById } from '@/lib/repositories/organizations'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

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
      { status: 400 }
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
          integrationType: 'kommo',
          organizationId: backendResult.connection.org_id,
          userId: backendResult.connection.org_id, // Using org_id as fallback
        })
      } catch (analyticsError) {
        console.error('Failed to track integration connected', analyticsError)
      }

      // Check if this is an agent-specific OAuth flow
      const cookieStore = await cookies()
      const agentId = cookieStore.get('kommo_oauth_agent_id')?.value
      const tenantId = cookieStore.get('kommo_oauth_tenant_id')?.value

      if (agentId && tenantId && organization?.slug) {
        // Create agent integration record
        try {
          const supabase = getSupabaseServiceRoleClient()

          // Check if integration already exists
          const { data: existing } = await supabase
            .from('agent_integrations')
            .select('id')
            .eq('agent_id', agentId)
            .eq('org_id', backendResult.connection.org_id)
            .eq('integration_type', 'kommo')
            .single()

          if (!existing) {
            // Create new agent integration
            await supabase.from('agent_integrations').insert({
              agent_id: agentId,
              org_id: backendResult.connection.org_id,
              integration_type: 'kommo',
              is_installed: true,
              is_active: true,
              settings: {
                oauth: true,
                base_domain: backendResult.connection.base_domain,
              },
            })
          } else {
            // Update existing integration
            await supabase
              .from('agent_integrations')
              .update({
                is_installed: true,
                is_active: true,
                settings: {
                  oauth: true,
                  base_domain: backendResult.connection.base_domain,
                },
              })
              .eq('id', existing.id)
          }

          // Clear cookies
          cookieStore.delete('kommo_oauth_agent_id')
          cookieStore.delete('kommo_oauth_tenant_id')

          // Redirect to agent integrations page
          const origin = new URL(request.url).origin
          const redirectUrl = new URL(
            `/manage/${tenantId}/ai-agents/${agentId}/edit/integrations`,
            origin
          )
          redirectUrl.searchParams.set('provider', 'kommo')
          redirectUrl.searchParams.set('status', 'success')
          return NextResponse.redirect(redirectUrl)
        } catch (dbError) {
          console.error('Failed to create agent integration:', dbError)
          // Fall through to organization-level redirect
        }
      }

      // Organization-level redirect (default)
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
      { status: 500 }
    )
  }
}
