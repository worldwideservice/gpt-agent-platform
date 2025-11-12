'use client'

import { createContext, ReactNode, useContext } from 'react'

export type TenantContextValue = {
  tenantId: string
  organizationId: string | null
  organizationName: string | null
}

const TenantContext = createContext<TenantContextValue | null>(null)

interface TenantProviderProps {
  value: TenantContextValue
  children: ReactNode
}

export function TenantProvider({ value, children }: TenantProviderProps) {
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext)

  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }

  return context
}
