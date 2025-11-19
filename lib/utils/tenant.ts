/**
 * Утилиты для работы с tenant-id
 * Формат: {slug} (например: makysm-holovatyi)
 * 
 * ПРИМЕЧАНИЕ: В KWID использовался формат {id}-{slug} (1000373-worldwideservices),
 * но текущая БД использует UUID для organizations.id, поэтому мы упростили до slug-only
 */

/**
 * Генерирует tenant-id из organization данных
 * Теперь просто возвращает slug
 */
export function generateTenantId(_organizationId: string, slug: string): string {
    return slug
}

/**
 * Парсит tenant-id и возвращает organization slug
 */
export function parseTenantId(tenantId: string): { slug: string } | null {
    if (!tenantId || tenantId.trim().length === 0) {
        return null
    }

    // tenantId = slug
    return { slug: tenantId }
}

/**
 * Получает tenant-id из organization
 */
export function getTenantIdFromOrganization(organization: { id: string; slug: string }): string {
    return organization.slug
}
