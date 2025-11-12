import { getOrganizationAiSettings } from '@/lib/repositories/organization-settings'
import { createOpenRouterClient, getOpenRouterClient, OpenRouterClient } from '@/lib/services/ai/openrouter.client'

const OPENROUTER_CACHE_TTL = 1000 * 60 * 5
const openRouterClientCache = new Map<string, { client: OpenRouterClient; expiresAt: number }>()

const getCachedClient = (orgId: string): OpenRouterClient | null => {
  const cached = openRouterClientCache.get(orgId)
  if (!cached) {
    return null
  }

  if (cached.expiresAt < Date.now()) {
    openRouterClientCache.delete(orgId)
    return null
  }

  return cached.client
}

const setCachedClient = (orgId: string, client: OpenRouterClient) => {
  openRouterClientCache.set(orgId, {
    client,
    expiresAt: Date.now() + OPENROUTER_CACHE_TTL,
  })
}

export const resolveOpenRouterClient = async (organizationId?: string | null): Promise<OpenRouterClient> => {
  if (!organizationId) {
    return getOpenRouterClient()
  }

  const cached = getCachedClient(organizationId)
  if (cached) {
    return cached
  }

  const settings = await getOrganizationAiSettings(organizationId)
  if (!settings || settings.aiProvider !== 'openrouter' || !settings.openrouterApiKey) {
    return getOpenRouterClient()
  }

  const client = createOpenRouterClient({
    apiKey: settings.openrouterApiKey,
    defaultModel: settings.openrouterDefaultModel ?? undefined,
    embeddingModel: settings.openrouterEmbeddingModel ?? undefined,
  })

  setCachedClient(organizationId, client)
  return client
}
