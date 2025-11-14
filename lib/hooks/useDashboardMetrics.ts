'use client'

import { useQuery } from '@tanstack/react-query'
import type { DashboardStats } from '@/types'

interface ActivitySeriesPoint {
  label: string
  value: number
}

export function useDashboardStats(tenantId: string, enabled = true) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/dashboard/stats`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export function useMonthlyResponses(tenantId: string, months = 6, enabled = true) {
  return useQuery<ActivitySeriesPoint[]>({
    queryKey: ['dashboard', 'monthly-responses', tenantId, months],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/dashboard/monthly-responses?months=${months}`)
      if (!response.ok) {
        throw new Error('Failed to fetch monthly responses')
      }
      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDailyResponses(tenantId: string, days = 10, enabled = true) {
  return useQuery<ActivitySeriesPoint[]>({
    queryKey: ['dashboard', 'daily-responses', tenantId, days],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/dashboard/daily-responses?days=${days}`)
      if (!response.ok) {
        throw new Error('Failed to fetch daily responses')
      }
      return response.json()
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}
