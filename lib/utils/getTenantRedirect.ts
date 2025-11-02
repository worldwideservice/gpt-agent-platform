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

    const supabase = getSupabaseServiceRoleClient();
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, slug")
      .eq("id", activeOrganization.id)
      .single();

    if (orgData && orgData.slug) {
      return generateTenantId(orgData.id, orgData.slug);
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

