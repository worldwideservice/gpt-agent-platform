'use client'

import { useParams } from 'next/navigation'

type ParamsWithTenant = {
  tenantId?: string
}

/**
 * Возвращает tenantId из URL (`/manage/[tenantId]/…`).
 * Если параметр отсутствует, возвращает `null`.
 */
export function useTenantId(): string | null {
  const params = useParams<ParamsWithTenant>()

  if (!params || typeof params.tenantId !== 'string') {
    return null
  }

  return params.tenantId
}
