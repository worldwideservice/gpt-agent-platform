import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

/**
 * Парсит tenantId (slug) и возвращает UUID организации из БД
 * @param tenantId - Slug организации (например, "makysm-holovatyi")
 * @returns UUID организации или null если не найдена
 */
export async function parseTenantIdToOrgId(tenantId: string): Promise<string | null> {
    if (!tenantId || tenantId.trim().length === 0) {
        logger.warn('[parseTenantIdToOrgId] Invalid tenantId', { tenantId })
        return null
    }

    // tenantId = slug
    const slug = tenantId

    // Find organization by slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

    if (error || !org) {
        logger.warn('[parseTenantIdToOrgId] Organization not found', { slug, error })
        return null
    }

    return org.id
}
