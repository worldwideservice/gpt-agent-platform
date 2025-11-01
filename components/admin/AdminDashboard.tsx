'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { KwidTabs, KwidTabsContent } from '@/components/kwid'
import { Badge } from '@/components/ui/shadcn/badge'
import { Label } from '@/components/ui/label'
import {
  Users,
  Building,
  Bot,
  Activity,
  Settings,
  Shield,
  Database,
  BarChart3,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  RefreshCw,
  Trash2,
  Edit,
  Eye
} from 'lucide-react'
import { AdminStats } from './AdminStats'
import { UserManagement } from './UserManagement'
import { SystemSettings } from './SystemSettings'

interface AdminStats {
  users: {
    total: number
    byTier: Record<string, number>
    newToday: number
  }
  organizations: {
    total: number
    byTier: Record<string, number>
  }
  agents: {
    total: number
    active: number
  }
  jobs: {
    total: number
    byStatus: Record<string, number>
  }
  usage: {
    tokensLast30Days: number
    requestsLast30Days: number
    sessionsLast30Days: number
  }
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Управление системой, пользователями и настройками платформы
        </p>
      </div>

      <KwidTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" tabs={[
        { value: 'overview', label: 'Обзор' },
        { value: 'users', label: 'Пользователи' },
        { value: 'system', label: 'Система' },
        { value: 'analytics', label: 'Аналитика' },
      ]} listClassName="grid w-full grid-cols-4">
        <KwidTabsContent value="overview" className="space-y-6">
          <AdminStats stats={stats} onRefresh={fetchStats} />
        </KwidTabsContent>

        <KwidTabsContent value="users" className="space-y-6">
          <UserManagement />
        </KwidTabsContent>

        <KwidTabsContent value="system" className="space-y-6">
          <SystemSettings />
        </KwidTabsContent>

        <KwidTabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Расширенная аналитика</CardTitle>
              <CardDescription>
                Детальная аналитика использования системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Расширенная аналитика в разработке
                </p>
              </div>
            </CardContent>
          </Card>
        </KwidTabsContent>
      </KwidTabs>
    </div>
  )
}
