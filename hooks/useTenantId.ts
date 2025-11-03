'use client'

import { useParams } from 'next/navigation'

/**
 * Хук для получения tenant-id из текущего пути
 * Используется в компонентах для построения URL
 */
export function useTenantId(): string | null {
 const params = useParams()
 
 if (params && 'tenantId' in params) {
 return params.tenantId as string
 }
 
 return null
}

/**
 * Хелпер для построения URL с tenant-id
 */
export function useTenantPath(path: string): string {
 const tenantId = useTenantId()
 
 if (!tenantId) {
 // Fallback на старый путь, если tenant-id нет
 return path
 }
 
 // Убираем ведущий слэш если есть
 const cleanPath = path.startsWith('/') ? path.slice(1) : path
 
 // Маппинг старых путей на новые Kwid пути
 const pathMapping: Record<string, string> = {
 '': '',
 'agents': 'ai-agents',
 'chat': 'test-chat',
 'knowledge-base/categories': 'knowledge-categories',
 'knowledge-base/articles': 'knowledge-items',
 'account': 'account-settings',
 'pricing': 'pricing',
 'support': 'support',
 'integrations': 'integrations',
 }
 
 const mappedPath = pathMapping[cleanPath] || cleanPath
 
 return `/manage/${tenantId}${mappedPath ? `/${mappedPath}` : ''}`
}
