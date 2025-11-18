import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * Проверяет, имеет ли указанный organizationId (из сессии) доступ
 * к tenantId (slug из URL).
 *
 * @param tenantId - The organization slug from the URL (e.g., "my-company")
 * @param organizationId - The organization ID from the user's session
 * @returns {Promise<boolean>} - True, если доступ разрешен, иначе false
 */
export async function validateTenantAccess(
  tenantId: string,
  organizationId: string
): Promise<boolean> {
  if (!tenantId || !organizationId) {
    return false
  }

  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .eq('id', organizationId)
      .maybeSingle()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    // Log error - use proper logger in production
    // eslint-disable-next-line no-console
    console.error('[VALIDATE_TENANT_ACCESS_ERROR]', error)
    return false
  }
}
