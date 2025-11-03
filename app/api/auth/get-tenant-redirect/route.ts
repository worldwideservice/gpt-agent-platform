import { NextResponse } from "next/server";

import { getTenantIdFromSession } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * API endpoint для получения tenant-id из текущей сессии
 * Используется клиентским компонентом после логина для редиректа
 */
export async function GET() {
 try {
 console.log("[get-tenant-redirect] API called");
 const tenantId = await getTenantIdFromSession();

 if (!tenantId) {
 console.warn("[get-tenant-redirect] No tenant-id found in session");
 return NextResponse.json(
 {
 success: false,
 tenantId: null,
 error: "Не удалось получить tenant-id из сессии",
 },
 { status: 200 }
 );
 }

 console.log("[get-tenant-redirect] Successfully got tenant-id:", tenantId);
 return NextResponse.json({
 success: true,
 tenantId,
 });
 } catch (error) {
 console.error("[get-tenant-redirect] Failed to get tenant redirect:", error);
 return NextResponse.json(
 {
 success: false,
 tenantId: null,
 error:
 error instanceof Error
 ? error.message
 : "Неизвестная ошибка при получении tenant-id",
 },
 { status: 500 }
 );
 }
}

