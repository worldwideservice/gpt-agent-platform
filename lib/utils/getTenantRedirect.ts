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
      return null;
    }

    const organizations = await getOrganizationsForUser(session.user.id);
    const activeOrganization =
      organizations.find(
        (organization) => organization.id === session.user.orgId,
      ) ??
      organizations[0] ??
      null;

    if (!activeOrganization) {
      return null;
    }

    // Проверяем, есть ли slug уже в организации
    let slug = activeOrganization.slug;
    
    // Если slug нет, получаем его из базы
    if (!slug) {
      const supabase = getSupabaseServiceRoleClient();
      const { data: orgData, error } = await supabase
        .from("organizations")
        .select("id, slug")
        .eq("id", activeOrganization.id)
        .single();

      if (error || !orgData) {
        console.error("Failed to get organization slug:", error);
        return null;
      }

      slug = orgData.slug;
    }

    // Если slug все еще отсутствует, создаем дефолтный на основе ID
    if (!slug) {
      // Генерируем slug на основе имени или ID
      const defaultSlug = activeOrganization.name 
        ? activeOrganization.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `org-${activeOrganization.id.substring(0, 8)}`
        : `org-${activeOrganization.id.substring(0, 8)}`;
      
      // Пытаемся сохранить slug в базу для будущих запросов
      try {
        const supabase = getSupabaseServiceRoleClient();
        await supabase
          .from("organizations")
          .update({ slug: defaultSlug })
          .eq("id", activeOrganization.id);
        
        slug = defaultSlug;
      } catch (error) {
        console.error("Failed to update organization slug:", error);
        // Используем временный slug даже если не удалось сохранить
        slug = defaultSlug;
      }
    }

    if (slug) {
      return generateTenantId(activeOrganization.id, slug);
    }

    return null;
  } catch (error) {
    console.error("Failed to get tenant-id from session:", error);
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

