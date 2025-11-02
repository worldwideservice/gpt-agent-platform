import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { generateTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

// Отключаем prerendering - всегда динамический
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Агенты ИИ",
  description: "Управление AI-агентами и настройка их поведения",
};

const AgentsPage = async () => {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  // Редиректим на новый формат с tenant-id
  const organizations = await getOrganizationsForUser(session.user.id);
  const activeOrganization =
    organizations.find(
      (organization) => organization.id === session.user.orgId,
    ) ??
    organizations[0] ??
    null;

  if (activeOrganization) {
    const supabase = getSupabaseServiceRoleClient();
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, slug")
      .eq("id", activeOrganization.id)
      .single();

    if (orgData) {
      const tenantId = generateTenantId(orgData.id, orgData.slug);
      redirect(`/manage/${tenantId}/ai-agents`);
    }
  }

  // Fallback - если не удалось получить tenant-id
  redirect("/login");
};

export default AgentsPage;
