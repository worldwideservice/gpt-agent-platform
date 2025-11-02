import { redirect } from "next/navigation";

import { HeaderWithSidebar } from "@/components/layout/HeaderWithSidebar";
import { SidebarProvider } from "@/components/layout/SidebarToggle";
import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { parseTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";
import { getSubscription } from "@/lib/repositories/subscriptions";

// Отключаем prerendering - всегда динамический для корректной работы auth
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ManageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}

const ManageLayout = async ({ children, params }: ManageLayoutProps) => {
  const resolvedParams = await params;
  const { tenantId } = resolvedParams;

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const organizations = await getOrganizationsForUser(session.user.id);

  if (organizations.length === 0) {
    console.error("[manage layout] User has no organizations");
    redirect("/login");
  }

  // Парсим tenantId чтобы найти организацию по slug
  const tenantData = parseTenantId(tenantId);
  let activeOrganization: any = null;
  
  if (tenantData) {
    // Пытаемся найти организацию по slug из tenantId
    activeOrganization = organizations.find((org) => org.slug === tenantData.slug);
    
    // Если не найдена по slug, пробуем найти по orgId из сессии
    if (!activeOrganization) {
      console.warn("[manage layout] Organization not found by slug, using orgId from session", {
        slug: tenantData.slug,
        orgId: session.user.orgId,
      });
      activeOrganization = organizations.find(
        (organization) => organization.id === session.user.orgId,
      );
    }
  } else {
    // Если tenantId не валидный, используем текущую организацию пользователя
    console.warn("[manage layout] Invalid tenantId format, using orgId from session", {
      tenantId,
      orgId: session.user.orgId,
    });
    activeOrganization = organizations.find(
      (organization) => organization.id === session.user.orgId,
    );
  }

  // Fallback - используем первую доступную организацию
  if (!activeOrganization) {
    console.warn("[manage layout] No organization found, using first available");
    activeOrganization = organizations[0];
  }

  // Проверяем что пользователь имеет доступ к этой организации
  if (
    activeOrganization &&
    !organizations.some((org) => org.id === activeOrganization.id)
  ) {
    console.error("[manage layout] User doesn't have access to organization", {
      orgId: activeOrganization.id,
      userId: session.user.id,
    });
    redirect("/login");
  }

  // Если организация найдена, но slug отсутствует - редиректим на правильный tenantId
  if (activeOrganization && (!activeOrganization.slug || activeOrganization.slug === '')) {
    console.warn("[manage layout] Organization missing slug, fetching from DB", {
      orgId: activeOrganization.id,
    });
    const supabase = getSupabaseServiceRoleClient();
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, slug")
      .eq("id", activeOrganization.id)
      .single();

    if (orgData?.slug) {
      const { generateTenantId } = await import("@/lib/utils/tenant");
      const newTenantId = generateTenantId(orgData.id, orgData.slug);
      console.log("[manage layout] Redirecting to correct tenantId", {
        old: tenantId,
        new: newTenantId,
      });
      redirect(`/manage/${newTenantId}`);
    }
  }

  // Если текущий tenantId не соответствует организации, редиректим на правильный
  if (activeOrganization?.slug) {
    const { generateTenantId } = await import("@/lib/utils/tenant");
    const correctTenantId = generateTenantId(activeOrganization.id, activeOrganization.slug);
    
    if (correctTenantId !== tenantId) {
      console.log("[manage layout] TenantId mismatch, redirecting to correct one", {
        current: tenantId,
        correct: correctTenantId,
      });
      redirect(`/manage/${correctTenantId}`);
    }
  }

  // Получаем дату подписки для Header (Kwid: отображение даты подписки)
  let subscriptionRenewsAt: string | null = null;
  if (activeOrganization) {
    const subscription = await getSubscription(activeOrganization.id);
    subscriptionRenewsAt = subscription?.renewsAt ?? null;
  }

  if (!activeOrganization) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <HeaderWithSidebar
        session={session}
        organizations={organizations}
        activeOrganization={activeOrganization}
        tenantId={tenantId}
      >
        {children}
      </HeaderWithSidebar>
    </SidebarProvider>
  );
};

export default ManageLayout;
