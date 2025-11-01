/**
 * Утилиты для работы с tenant-id в формате Kwid
 * Формат: {id}-{slug} (например: 1000373-worldwideservices)
 */

/**
 * Генерирует tenant-id из organization данных
 * Формат: {numericId}-{slug}
 */
export function generateTenantId(organizationId: string, slug: string): string {
  // Конвертируем UUID в числовой ID (первые 7 символов hex конвертируем в число)
  const numericPart = organizationId
    .replace(/-/g, '')
    .substring(0, 7)
    .split('')
    .reduce((acc, char) => acc + parseInt(char, 16), 0)
    .toString()
  
  // Объединяем с slug
  return `${numericPart}-${slug}`
}

/**
 * Парсит tenant-id и возвращает organization slug
 */
export function parseTenantId(tenantId: string): { slug: string } | null {
  const parts = tenantId.split('-')
  if (parts.length < 2) {
    return null
  }
  
  // Все после первого дефиса - это slug
  const slug = parts.slice(1).join('-')
  
  return { slug }
}

/**
 * Получает tenant-id из organization
 */
export function getTenantIdFromOrganization(organization: { id: string; slug: string }): string {
  return generateTenantId(organization.id, organization.slug)
}

