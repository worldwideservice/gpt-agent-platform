import { redirect } from "next/navigation";

import { HeaderWithSidebar } from "@/components/layout/HeaderWithSidebar";
import { SidebarProvider } from "@/components/layout/SidebarToggle";
import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";

// Отключаем prerendering - всегда динамический для корректной работы auth
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  let session: any;
  let organizations: any[] = [];
  let activeOrganization: any = null;

  try {
    session = await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    try {
      organizations = await getOrganizationsForUser(session.user.id);
      activeOrganization =
        organizations.find(
          (organization) => organization.id === session.user.orgId,
        ) ??
        organizations[0] ??
        null;
    } catch (orgError) {
      organizations = [];
      activeOrganization = null;
    }
  } catch (authError) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <HeaderWithSidebar
        session={session}
        organizations={organizations}
        activeOrganization={activeOrganization}
      >
        {children}
      </HeaderWithSidebar>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
