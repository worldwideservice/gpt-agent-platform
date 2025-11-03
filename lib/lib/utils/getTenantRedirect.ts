/**
 * Утилита для получения tenant-id из сессии и редиректа на новый формат URL
 * Используется в старых страницах для редиректа на формат /manage/[tenantId]/...
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { generateTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

/**
 * Получает tenant-id из текущей сессии пользователя
 * @returns tenant-id в формате {numericId}-{slug} или null если не удалось получить
 */
export async function getTenantIdFromSession(): Promise<string | null> {
 try {
 const session = await auth();

 if (!session?.user?.orgId) {
 console.warn("[getTenantIdFromSession] No session or orgId found", {
 hasSession: !!session,
 hasOrgId: !!session?.user?.orgId,
 });
 return null;
 }

 console.log("[getTenantIdFromSession] Getting organizations for user", {
 userId: session.user.id,
 orgId: session.user.orgId,
 });

 const organizations = await getOrganizationsForUser(session.user.id);
 const activeOrganization =
 organizations.find(
 (organization) => organization.id === session.user.orgId,
 ) ??
 organizations[0] ??
 null;

 if (!activeOrganization) {
 console.warn("[getTenantIdFromSession] No active organization found", {
 userId: session.user.id,
 organizationsCount: organizations.length,
 orgId: session.user.orgId,
 });
 return null;
 }

 console.log("[getTenantIdFromSession] Active organization found", {
 orgId: activeOrganization.id,
 orgName: activeOrganization.name,
 hasSlug: !!activeOrganization.slug,
 });

 // Проверяем, есть ли slug уже в организации
 let slug = activeOrganization.slug;
 
 // Если slug нет, получаем его из базы
 if (!slug) {
 console.log("[getTenantIdFromSession] Slug not in organization object, fetching from DB", {
 orgId: activeOrganization.id,
 });
 const supabase = getSupabaseServiceRoleClient();
 const { data: orgData, error } = await supabase
 .from("organizations")
 .select("id, slug")
 .eq("id", activeOrganization.id)
 .single();

 if (error) {
 console.error("[getTenantIdFromSession] Error fetching organization slug from DB", {
 orgId: activeOrganization.id,
 error: error.message,
 code: error.code,
 });
 }

 if (!orgData) {
 console.warn("[getTenantIdFromSession] Organization not found in DB", {
 orgId: activeOrganization.id,
 });
 }

 if (orgData?.slug) {
 slug = orgData.slug;
 console.log("[getTenantIdFromSession] Slug retrieved from DB", {
 orgId: activeOrganization.id,
 slug,
 });
 }
 }

 // Если slug все еще отсутствует, создаем дефолтный на основе ID
 if (!slug) {
 console.warn("[getTenantIdFromSession] Slug still missing, generating default", {
 orgId: activeOrganization.id,
 orgName: activeOrganization.name,
 });
 
 // Генерируем slug на основе имени или ID
 const defaultSlug = activeOrganization.name 
 ? activeOrganization.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `org-${activeOrganization.id.substring(0, 8)}`
 : `org-${activeOrganization.id.substring(0, 8)}`;
 
 console.log("[getTenantIdFromSession] Generated default slug", {
 orgId: activeOrganization.id,
 defaultSlug,
 });
 
 // Пытаемся сохранить slug в базу для будущих запросов
 try {
 const supabase = getSupabaseServiceRoleClient();
 const { error: updateError } = await supabase
 .from("organizations")
 .update({ slug: defaultSlug })
 .eq("id", activeOrganization.id);
 
 if (updateError) {
 console.error("[getTenantIdFromSession] Failed to update organization slug in DB", {
 orgId: activeOrganization.id,
 defaultSlug,
 error: updateError.message,
 code: updateError.code,
 });
 } else {
 console.log("[getTenantIdFromSession] Successfully updated organization slug in DB", {
 orgId: activeOrganization.id,
 slug: defaultSlug,
 });
 }
 
 slug = defaultSlug;
 } catch (error) {
 console.error("[getTenantIdFromSession] Exception while updating organization slug", {
 orgId: activeOrganization.id,
 defaultSlug,
 error: error instanceof Error ? error.message : String(error),
 });
 // Используем временный slug даже если не удалось сохранить
 slug = defaultSlug;
 }
 }

 if (slug) {
 const tenantId = generateTenantId(activeOrganization.id, slug);
 console.log("[getTenantIdFromSession] Successfully generated tenant-id", {
 orgId: activeOrganization.id,
 slug,
 tenantId,
 });
 return tenantId;
 }

 console.error("[getTenantIdFromSession] Failed to get or generate slug", {
 orgId: activeOrganization.id,
 orgName: activeOrganization.name,
 });
 return null;
 } catch (error) {
 console.error("[getTenantIdFromSession] Unexpected error", {
 error: error instanceof Error ? error.message : String(error),
 stack: error instanceof Error ? error.stack : undefined,
 });
 return null;
 }
}

/**
 * Редиректит на страницу с tenant-id, если пользователь авторизован
 * @param newPath - новый путь без /manage/[tenantId] (например: '/ai-agents')
 * @param fallbackPath - путь для редиректа, если не удалось получить tenant-id (по умолчанию '/login')
 */
export async function redirectToTenantPath(
 newPath: string,
 fallbackPath: string = "/login"
): Promise<never> {
 const tenantId = await getTenantIdFromSession();

 if (tenantId) {
 redirect(`/manage/${tenantId}${newPath}`);
 }

 redirect(fallbackPath);
}

