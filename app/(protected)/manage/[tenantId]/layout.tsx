import { redirect } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className="fi-layout min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          organizations={organizations}
          activeOrganizationId={activeOrganization?.id ?? session.user.orgId}
          tenantId={tenantId}
        />
        <div className="fi-main-ctn flex-1 lg:ml-72 xl:ml-80 flex flex-col">
          <Header
            user={session.user}
            subscriptionRenewsAt={subscriptionRenewsAt}
            tenantId={tenantId}
          />
          <main className="flex-1 bg-slate-50">
            <div className="px-6 py-6 lg:px-8 lg:py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ManageLayout;
