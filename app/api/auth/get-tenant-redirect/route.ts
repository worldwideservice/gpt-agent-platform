import { NextResponse } from "next/server";

import { getTenantIdFromSession } from "@/lib/utils/getTenantRedirect";
import { logger } from "@/lib/utils/logger";
import { metrics } from "@/lib/utils/metrics";



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
/**
 * API endpoint для получения tenant-id из текущей сессии
 * Используется клиентским компонентом после логина для редиректа
 * 
 * Performance: Оптимизирован для быстрого ответа
 * Security: Не возвращает sensitive данные
 */
export async function GET() {
 const startTime = Date.now()
 
 try {
 logger.debug("[get-tenant-redirect] API called");
 const tenantId = await getTenantIdFromSession();

 if (!tenantId) {
 logger.warn("[get-tenant-redirect] No tenant-id found in session");
 return NextResponse.json(
 {
 success: false,
 tenantId: null,
 error: "Не удалось получить tenant-id из сессии",
 },
 { status: 200 }
 );
 }

 const duration = Date.now() - startTime
 logger.debug("[get-tenant-redirect] Successfully got tenant-id", {
 tenantId: tenantId.substring(0, 8) + '...', // Partial for logging
 })
 
 logger.performance("get-tenant-redirect", duration)
 
 // Record metric for monitoring
 metrics.recordApiCall('/api/auth/get-tenant-redirect', duration, 200)
 
 return NextResponse.json({
 success: true,
 tenantId,
 });
 } catch (error) {
 const errorInstance = error instanceof Error ? error : new Error(String(error))
 const duration = Date.now() - startTime
 logger.error("[get-tenant-redirect] Failed to get tenant redirect", errorInstance, {
 duration: `${duration}ms`,
 })
 
 // Record error metric
 metrics.recordError('get-tenant-redirect', {
 errorType: errorInstance.message,
 })
 metrics.recordApiCall('/api/auth/get-tenant-redirect', duration, 500)
 
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

