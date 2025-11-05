import { redirect } from "next/navigation";

import { HeaderWithSidebar } from "@/components/layout/HeaderWithSidebar";
import { SidebarProvider } from "@/components/layout/SidebarToggle";
import { RefineProvider } from "@/components/refine/providers";
import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { validateTenantIdAccess } from "@/lib/utils/tenant-validation";
import { generateTenantId } from "@/lib/utils/tenant";

// Отключаем prerendering - всегда динамический для корректной работы auth
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ManageLayoutProps {
 children: React.ReactNode;
 params: Promise<{ tenantId: string }>;
}

const ManageLayout = async ({ children, params }: ManageLayoutProps) => {
 const { tenantId } = await params;
 
 let session: any;
 let organizations: any[] = [];
 let activeOrganization: any = null;

 try {
 session = await auth();

 if (!session?.user?.orgId || !session?.user?.id) {
 redirect("/login");
 }

 // Получаем список организаций пользователя
 try {
 organizations = await getOrganizationsForUser(session.user.id);
 
 // Валидируем tenant-id и находим организацию
 const validation = await validateTenantIdAccess(tenantId, session.user.id);
 
 if (validation.valid && validation.organization) {
 // Организация найдена и доступна пользователю
 activeOrganization = {
 id: validation.organization.id,
 name: validation.organization.name,
 slug: validation.organization.slug,
 };
 
 // Проверяем, соответствует ли tenant-id организации
 const expectedTenantId = generateTenantId(activeOrganization.id, activeOrganization.slug);
 
 if (tenantId !== expectedTenantId) {
 // Tenant-id не соответствует - редиректим на правильный
 console.log("[manage layout] Tenant-id mismatch, redirecting to correct tenant-id", {
 current: tenantId,
 expected: expectedTenantId,
 });
 redirect(`/manage/${expectedTenantId}`);
 }
 
 // Обновляем session.user.orgId если нужно
 if (session.user.orgId !== activeOrganization.id) {
 // Организация не совпадает с сессией, но это нормально если пользователь имеет доступ
 // Можно обновить сессию, но лучше просто использовать активную организацию
 }
 } else {
 // Tenant-id невалиден или недоступен - пробуем найти организацию по orgId из сессии
 activeOrganization =
 organizations.find(
 (organization) => organization.id === session.user.orgId,
 ) ??
 organizations[0] ??
 null;

 if (activeOrganization) {
 // Генерируем правильный tenant-id и редиректим
 const correctTenantId = generateTenantId(activeOrganization.id, activeOrganization.slug);
 console.log("[manage layout] Invalid tenant-id, redirecting to correct", {
 invalid: tenantId,
 correct: correctTenantId,
 });
 redirect(`/manage/${correctTenantId}`);
 } else {
 // Организация не найдена - редирект на логин
 console.error("[manage layout] No organization found for user");
 redirect("/login");
 }
 }
 } catch (orgError) {
    console.error("[manage layout] Error getting organizations", orgError);
    
    // Логируем детальную ошибку для отладки
    if (orgError instanceof Error) {
      console.error("[manage layout] Error details:", {
        message: orgError.message,
        stack: orgError.stack,
      });
    }
    
    organizations = [];
    activeOrganization = null;
    
    // Не редиректим сразу, чтобы не скрыть ошибку
    // Вместо этого пробуем найти организацию по orgId из сессии
    if (session?.user?.orgId) {
      try {
        const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin');
        const supabase = getSupabaseServiceRoleClient();
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id, name, slug')
          .eq('id', session.user.orgId)
          .single();
        
        if (orgData) {
          const { generateTenantId } = await import('@/lib/utils/tenant');
          const correctTenantId = generateTenantId(orgData.id, orgData.slug || `org-${orgData.id.substring(0, 8)}`);
          redirect(`/manage/${correctTenantId}`);
        }
      } catch (fallbackError) {
        console.error("[manage layout] Fallback error:", fallbackError);
      }
    }
    
    redirect("/login");
  }
} catch (authError) {
  console.error("[manage layout] Auth error", authError);
  
  // Логируем детальную ошибку для отладки
  if (authError instanceof Error) {
    console.error("[manage layout] Auth error details:", {
      message: authError.message,
      stack: authError.stack,
    });
  }
  
  redirect("/login");
}

 return (
   <RefineProvider>
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
   </RefineProvider>
 );
};

export default ManageLayout;

