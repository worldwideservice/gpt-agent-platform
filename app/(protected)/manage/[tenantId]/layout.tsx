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

  // Парсим tenantId чтобы найти организацию по slug
  const tenantData = parseTenantId(tenantId);
  let activeOrganization: any = null;
  
  if (tenantData) {
    activeOrganization =
      organizations.find((org) => org.slug === tenantData.slug) ??
      organizations[0] ??
      null;
  } else {
    // Если tenantId не валидный, используем текущую организацию пользователя
    activeOrganization =
      organizations.find(
        (organization) => organization.id === session.user.orgId,
      ) ??
      organizations[0] ??
      null;
  }

  // Проверяем что пользователь имеет доступ к этой организации
  if (
    activeOrganization &&
    !organizations.some((org) => org.id === activeOrganization.id)
  ) {
    redirect("/login");
  }

  // Если организация не найдена, редиректим на первую доступную
  if (!activeOrganization && organizations.length > 0) {
    const firstOrg = organizations[0];
    const supabase = getSupabaseServiceRoleClient();
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, slug")
      .eq("id", firstOrg.id)
      .single();

    if (orgData) {
      const { generateTenantId } = await import("@/lib/utils/tenant");
      const newTenantId = generateTenantId(orgData.id, orgData.slug);
      redirect(`/manage/${newTenantId}`);
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
