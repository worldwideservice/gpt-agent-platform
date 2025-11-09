/**
 * Утилита для получения tenant-id из сессии и редиректа на новый формат URL
 * Используется в старых страницах для редиректа на формат /manage/[tenantId]/...
 */

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { generateTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { tenantCache } from "@/lib/utils/tenant-cache";

/**
 * Получает tenant-id из текущей сессии пользователя
 * @returns tenant-id в формате {numericId}-{slug} или null если не удалось получить
 */
export async function getTenantIdFromSession(): Promise<string | null> {
 const startTime = Date.now()
 
 try {
 const session = await auth();

 if (!session?.user?.id) {
 logger.warn("[getTenantIdFromSession] No session or userId found", {
 hasSession: !!session,
 hasUserId: !!session?.user?.id,
 });
 return null;
 }

 // Если orgId нет в сессии, пытаемся получить его из базы данных
 let orgId = session?.user?.orgId;
 if (!orgId && session.user.id) {
   logger.debug("[getTenantIdFromSession] orgId not in session, fetching from DB", {
     userId: session.user.id,
     email: session.user.email,
   });
   
   try {
     const organizations = await getOrganizationsForUser(session.user.id);
     logger.debug("[getTenantIdFromSession] Organizations fetched from DB", {
       userId: session.user.id,
       organizationsCount: organizations.length,
       organizations: organizations.map(org => ({ id: org.id, name: org.name, slug: org.slug })),
     });
     
     if (organizations.length > 0) {
       // Используем первую организацию как orgId
       orgId = organizations[0].id;
       logger.debug("[getTenantIdFromSession] Found orgId from DB", {
         userId: session.user.id,
         orgId,
         organizationsCount: organizations.length,
       });
       
       // ВАЖНО: Обновляем кэш tenant-id с новым orgId
       // Это нужно для того, чтобы последующие запросы использовали правильный orgId
       const cachedTenantId = tenantCache.get(session.user.id, orgId);
       if (cachedTenantId) {
         logger.debug("[getTenantIdFromSession] Found cached tenant-id for resolved orgId", {
           orgId,
           tenantId: cachedTenantId.substring(0, 8) + '...',
         });
       }
     } else {
       logger.warn("[getTenantIdFromSession] No organizations found for user", {
         userId: session.user.id,
         email: session.user.email,
       });
       
       // Для демо-пользователя создаем организацию если её нет
       if (session.user.id === '00000000-0000-4000-8000-0000000000ff') {
         logger.debug("[getTenantIdFromSession] Demo user detected, checking for default org");
         const defaultOrgId = process.env.SUPABASE_DEFAULT_ORGANIZATION_ID;
         if (defaultOrgId) {
           orgId = defaultOrgId;
           logger.debug("[getTenantIdFromSession] Using default orgId for demo user", { orgId: defaultOrgId });
         } else {
           logger.error("[getTenantIdFromSession] No default orgId for demo user");
           return null;
         }
       } else {
         // Для реального пользователя без организации - это ошибка
         logger.error("[getTenantIdFromSession] Real user has no organizations - this should not happen", {
           userId: session.user.id,
           email: session.user.email,
         });
         return null;
       }
     }
   } catch (error) {
     logger.error("[getTenantIdFromSession] Error fetching organizations from DB",
       error instanceof Error ? error : new Error(String(error)),
       { userId: session.user.id, email: session.user.email }
     );
     return null;
   }
 }

 if (!orgId) {
 logger.warn("[getTenantIdFromSession] No orgId found after fallback", {
 hasSession: !!session,
 hasOrgId: !!session?.user?.orgId,
 hasUserId: !!session?.user?.id,
 });
 return null;
 }

 // Check cache first
 const cachedTenantId = tenantCache.get(session.user.id, orgId)
 if (cachedTenantId) {
 const duration = Date.now() - startTime
 logger.debug("[getTenantIdFromSession] Tenant-id from cache", {
 userId: session.user.id,
 orgId: orgId,
 duration: `${duration}ms`,
 })
 logger.debug("[getTenantIdFromSession] Performance (cached)", { duration: `${duration}ms` })
 return cachedTenantId
 }

 logger.debug("[getTenantIdFromSession] Getting organizations for user", {
 userId: session.user.id,
 orgId: orgId,
 });

 const organizations = await getOrganizationsForUser(session.user.id);
 logger.debug("[getTenantIdFromSession] All organizations for user", {
 userId: session.user.id,
 orgId: orgId,
 organizationsCount: organizations.length,
 organizations: organizations.map(org => ({ id: org.id, name: org.name, slug: org.slug })),
 });
 
 let activeOrganization =
 organizations.find(
 (organization) => organization.id === orgId,
 ) ??
 organizations[0] ??
 null;

 // Если организация не найдена, но есть orgId (для демо-пользователя)
 if (!activeOrganization && orgId) {
 logger.debug("[getTenantIdFromSession] Organization not in list, creating minimal org object", {
 userId: session.user.id,
 orgId: orgId,
 });
 // Создаем минимальный объект организации для демо-пользователя
 activeOrganization = {
 id: orgId,
 name: 'Demo Organization',
 slug: '',
 };
 }

 if (!activeOrganization) {
 logger.warn("[getTenantIdFromSession] No active organization found", {
 userId: session.user.id,
 organizationsCount: organizations.length,
 orgId: orgId,
 email: session.user.email,
 });
 return null;
 }

 logger.debug("[getTenantIdFromSession] Active organization found", {
 orgId: activeOrganization.id,
 orgName: activeOrganization.name,
 hasSlug: !!activeOrganization.slug,
 });

 // Проверяем, есть ли slug уже в организации
 let slug = activeOrganization.slug;
 
 // Если slug нет, получаем его из базы
 if (!slug) {
 logger.debug("[getTenantIdFromSession] Slug not in organization object, fetching from DB", {
 orgId: activeOrganization.id,
 });
 const supabase = getSupabaseServiceRoleClient();
 const { data: orgData, error } = await supabase
 .from("organizations")
 .select("id, slug")
 .eq("id", activeOrganization.id)
 .single();

 if (error) {
 logger.error("[getTenantIdFromSession] Error fetching organization slug from DB", 
  new Error(error.message), 
  {
   orgId: activeOrganization.id,
   code: error.code,
  }
 );
 }

 if (!orgData) {
 logger.warn("[getTenantIdFromSession] Organization not found in DB", {
 orgId: activeOrganization.id,
 });
 }

 if (orgData?.slug) {
 slug = orgData.slug;
 logger.debug("[getTenantIdFromSession] Slug retrieved from DB", {
 orgId: activeOrganization.id,
 slug,
 });
 }
 }

 // Если slug все еще отсутствует, создаем дефолтный на основе ID
 if (!slug) {
 logger.warn("[getTenantIdFromSession] Slug still missing, generating default", {
 orgId: activeOrganization.id,
 orgName: activeOrganization.name,
 });
 
 // Генерируем slug на основе имени или ID
 const defaultSlug = activeOrganization.name 
 ? activeOrganization.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `org-${activeOrganization.id.substring(0, 8)}`
 : `org-${activeOrganization.id.substring(0, 8)}`;
 
 logger.debug("[getTenantIdFromSession] Generated default slug", {
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
 logger.error("[getTenantIdFromSession] Failed to update organization slug in DB", 
  new Error(updateError.message),
  {
   orgId: activeOrganization.id,
   defaultSlug,
   code: updateError.code,
  }
 );
 } else {
 logger.debug("[getTenantIdFromSession] Successfully updated organization slug in DB", {
 orgId: activeOrganization.id,
 slug: defaultSlug,
 });
 }
 
 slug = defaultSlug;
 } catch (error) {
 const errorInstance = error instanceof Error ? error : new Error(String(error))
 logger.error("[getTenantIdFromSession] Exception while updating organization slug", 
  errorInstance,
  {
   orgId: activeOrganization.id,
   defaultSlug,
  }
 );
 // Используем временный slug даже если не удалось сохранить
 slug = defaultSlug;
 }
 }

 if (slug) {
 const tenantId = generateTenantId(activeOrganization.id, slug);
 const duration = Date.now() - startTime
 logger.debug("[getTenantIdFromSession] Successfully generated tenant-id", {
 orgId: activeOrganization.id,
 slug,
 tenantId: tenantId.substring(0, 8) + '...', // Partial for logging
 });
 
 // Log performance if operation took longer than expected
 logger.debug("[getTenantIdFromSession] Performance", {
 duration: `${duration}ms`,
 orgId: activeOrganization.id,
 hasSlugInCache: !!activeOrganization.slug,
 })
 
 // Cache the result for future requests
 tenantCache.set(session.user.id, orgId, tenantId)
 
 return tenantId;
 }

 logger.error("[getTenantIdFromSession] Failed to get or generate slug", 
  new Error("Slug generation failed"),
  {
   orgId: activeOrganization.id,
   orgName: activeOrganization.name,
  }
 );
 return null;
 } catch (error) {
 const errorInstance = error instanceof Error ? error : new Error(String(error))
 logger.error("[getTenantIdFromSession] Unexpected error", errorInstance, {
 stack: errorInstance.stack,
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

