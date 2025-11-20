// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

interface SearchResult {
  id: string
  title: string
  description?: string
  url: string
  category: 'agent' | 'knowledge' | 'page'
  icon?: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const orgId = searchParams.get('orgId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
      })
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const supabase = getSupabaseServiceRoleClient()
    const searchQuery = `%${query.toLowerCase()}%`
    const results: SearchResult[] = []

    // Search in agents
    try {
      const { data: agents } = await supabase
        .from('agents')
        .select('id, name, description, is_active')
        .eq('org_id', orgId)
        .or(`name.ilike.${searchQuery},description.ilike.${searchQuery}`)
        .limit(limit)

      if (agents) {
        agents.forEach((agent) => {
          results.push({
            id: agent.id,
            title: agent.name,
            description: agent.description || 'AI Agent',
            url: `/manage/${orgId}/ai-agents/${agent.id}`,
            category: 'agent',
            icon: 'Bot',
          })
        })
      }
    } catch (error) {
      logger.error('Failed to search agents', error as Error)
    }

    // Search in knowledge base
    try {
      const { data: knowledge } = await supabase
        .from('company_knowledge')
        .select('id, title, content, category')
        .eq('org_id', orgId)
        .or(`title.ilike.${searchQuery},content.ilike.${searchQuery}`)
        .limit(limit)

      if (knowledge) {
        knowledge.forEach((item) => {
          results.push({
            id: item.id,
            title: item.title || 'Document',
            description: item.category || 'Knowledge Base',
            url: `/manage/${orgId}/knowledge-base`,
            category: 'knowledge',
            icon: 'FileText',
          })
        })
      }
    } catch (error) {
      logger.error('Failed to search knowledge base', error as Error)
    }

    // Add static pages that match search
    const staticPages = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Overview and statistics',
        url: `/manage/${orgId}/dashboard`,
        category: 'page' as const,
        icon: 'LayoutDashboard',
      },
      {
        id: 'ai-agents',
        title: 'AI Agents',
        description: 'Manage your AI agents',
        url: `/manage/${orgId}/ai-agents`,
        category: 'page' as const,
        icon: 'Bot',
      },
      {
        id: 'knowledge-base',
        title: 'Knowledge Base',
        description: 'Manage knowledge and documents',
        url: `/manage/${orgId}/knowledge-base`,
        category: 'page' as const,
        icon: 'BookOpen',
      },
      {
        id: 'integrations',
        title: 'Integrations',
        description: 'Connect external services',
        url: `/manage/${orgId}/integrations`,
        category: 'page' as const,
        icon: 'Plug',
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Organization settings',
        url: `/manage/${orgId}/settings`,
        category: 'page' as const,
        icon: 'Settings',
      },
    ]

    staticPages.forEach((page) => {
      if (
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(page)
      }
    })

    // Sort by relevance (exact match first, then partial match)
    const sortedResults = results
      .sort((a, b) => {
        const aExact = a.title.toLowerCase() === query.toLowerCase()
        const bExact = b.title.toLowerCase() === query.toLowerCase()
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return 0
      })
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      results: sortedResults,
      count: sortedResults.length,
    })
  } catch (error) {
    logger.error('Failed to perform search', error as Error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
