/**
 * Утилиты для валидации и работы с tenant-id
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import { parseTenantId } from "./tenant";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { logger } from "@/lib/utils";

/**
 * Находит организацию по slug из tenant-id
 */
export async function findOrganizationBySlug(slug: string) {
 const supabase = getSupabaseServiceRoleClient();
 
 const { data, error } = await supabase
 .from("organizations")
 .select("id, name, slug")
 .eq("slug", slug)
 .single();

 if (error || !data) {
 return null;
 }

 return {
 id: data.id,
 name: data.name,
 slug: data.slug,
 };
}

/**
 * Валидирует tenant-id и проверяет доступ пользователя к организации
 */
export async function validateTenantIdAccess(
 tenantId: string,
 userId: string
): Promise<{ valid: boolean; organization?: { id: string; name: string; slug: string } }> {
 try {
 // Парсим tenant-id
 const parsed = parseTenantId(tenantId);
 if (!parsed || !parsed.slug) {
 logger.warn("validateTenantIdAccess: Invalid tenant-id format", { tenantId });
 return { valid: false };
 }

 // Находим организацию по slug
 const organization = await findOrganizationBySlug(parsed.slug);
 if (!organization) {
 logger.warn("validateTenantIdAccess: Organization not found", { slug: parsed.slug });
 return { valid: false };
 }

 // Получаем список организаций пользователя
 const userOrganizations = await getOrganizationsForUser(userId);

 // Проверяем, что организация принадлежит пользователю
 const hasAccess = userOrganizations.some(org => org.id === organization.id);

 if (!hasAccess) {
 logger.warn("validateTenantIdAccess: User doesn't have access to organization", {
 userId,
 organizationId: organization.id,
 });
 return { valid: false };
 }

 return {
 valid: true,
 organization,
 };
 } catch (error) {
 logger.error("validateTenantIdAccess: Error validating tenant-id", error as Error, {
 tenantId,
 });
 return { valid: false };
 }
}

