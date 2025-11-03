'use client'

import { useEffect, useState } from 'react'
import { useWebSocket } from '@/lib/websocket/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
 Bell,
 BellRing,
 Check,
 X,
 Info,
 AlertTriangle,
 AlertCircle,
 Zap,
 Users,
 Bot,
 Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
 id: string
 type: 'notification' | 'announcement' | 'system' | 'job' | 'agent'
 level?: 'info' | 'warning' | 'error' | 'success'
 title: string
 message: string
 timestamp: Date
 read: boolean
 actionUrl?: string
 actionText?: string
}

interface RealTimeNotificationsProps {
 className?: string
 maxNotifications?: number
 showUnreadOnly?: boolean
}

export const RealTimeNotifications = ({
 className,
 maxNotifications = 50,
 showUnreadOnly = false
}: RealTimeNotificationsProps) => {
 const [notifications, setNotifications] = useState<Notification[]>([])
 const [unreadCount, setUnreadCount] = useState(0)
 const [isConnected, setIsConnected] = useState(false)
 const ws = useWebSocket()

 useEffect(() => {
 setIsConnected(ws.isConnected())

 // Subscribe to notification events
 const unsubscribeNotification = ws.onNotification((notification) => {
 const newNotification: Notification = {
 id: notification.id,
 type: notification.type || 'notification',
 level: notification.level || 'info',
 title: notification.title,
 message: notification.message,
 timestamp: new Date(notification.timestamp),
 read: notification.read || false,
 actionUrl: notification.actionUrl,
 actionText: notification.actionText,
 }

 setNotifications(prev => [newNotification, ...prev.slice(0, maxNotifications - 1)])
 if (!newNotification.read) {
 setUnreadCount(prev => prev + 1)
 }
 })

 const unsubscribeAnnouncement = ws.onSystemAnnouncement((announcement) => {
 const newNotification: Notification = {
 id: announcement.id,
 type: 'announcement',
 level: announcement.level || 'info',
 title: announcement.title,
 message: announcement.message,
 timestamp: new Date(announcement.timestamp),
 read: false,
 }

 setNotifications(prev => [newNotification, ...prev.slice(0, maxNotifications - 1)])
 setUnreadCount(prev => prev + 1)
 })

 const unsubscribeJob = ws.onJobUpdate((job) => {
 const newNotification: Notification = {
 id: `job_${job.jobId}_${Date.now()}`,
 type: 'job',
 level: 'info',
 title: 'Обновление задачи',
 message: job.message || `Задача ${job.jobId} обновлена`,
 timestamp: new Date(job.timestamp),
 read: false,
 }

 setNotifications(prev => [newNotification, ...prev.slice(0, maxNotifications - 1)])
 setUnreadCount(prev => prev + 1)
 })

 const unsubscribeAgent = ws.onAgentStatusChange((agent) => {
 const newNotification: Notification = {
 id: `agent_${agent.agentId}_${Date.now()}`,
 type: 'agent',
 level: 'info',
 title: 'Изменение статуса агента',
 message: `Агент ${agent.agentId} изменил статус на ${agent.status}`,
 timestamp: new Date(agent.timestamp),
 read: false,
 }

 setNotifications(prev => [newNotification, ...prev.slice(0, maxNotifications - 1)])
 setUnreadCount(prev => prev + 1)
 })

 // Cleanup function
 return () => {
 unsubscribeNotification()
 unsubscribeAnnouncement()
 unsubscribeJob()
 unsubscribeAgent()
 }
 }, [ws, maxNotifications])

 const markAsRead = (notificationId: string) => {
 setNotifications(prev =>
 prev.map(notification =>
 notification.id === notificationId
 ? { ...notification, read: true }
 : notification
 )
 )
 setUnreadCount(prev => Math.max(0, prev - 1))
 ws.markNotificationAsRead(notificationId)
 }

 const markAllAsRead = () => {
 setNotifications(prev =>
 prev.map(notification => ({ ...notification, read: true }))
 )
 setUnreadCount(0)
 }

 const deleteNotification = (notificationId: string) => {
 const notification = notifications.find(n => n.id === notificationId)
 setNotifications(prev => prev.filter(n => n.id !== notificationId))
 if (notification && !notification.read) {
 setUnreadCount(prev => Math.max(0, prev - 1))
 }
 }

 const getNotificationIcon = (type: string, level?: string) => {
 switch (type) {
 case 'announcement':
 return <BellRing className="h-4 w-4" />
 case 'system':
 return <Activity className="h-4 w-4" />
 case 'job':
 return <Zap className="h-4 w-4" />
 case 'agent':
 return <Bot className="h-4 w-4" />
 default:
 switch (level) {
 case 'error':
 return <AlertCircle className="h-4 w-4 text-red-500" />
 case 'warning':
 return <AlertTriangle className="h-4 w-4 text-yellow-500" />
 case 'success':
 return <Check className="h-4 w-4 text-green-500" />
 default:
 return <Info className="h-4 w-4 text-blue-500" />
 }
 }
 }

  const getNotificationColor = (level?: string) => {
    switch (level) {
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

 const filteredNotifications = showUnreadOnly
 ? notifications.filter(n => !n.read)
 : notifications

 return (
 <Card className={cn('w-full max-w-md', className)}>
 <CardHeader className="pb-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Bell className="h-5 w-5" />
 <CardTitle className="text-lg">Уведомления</CardTitle>
 {unreadCount > 0 && (
 <Badge variant="destructive" className="text-xs">
 {unreadCount}
 </Badge>
 )}
 </div>
 <div className="flex items-center gap-2">
 <div className={cn(
 'w-2 h-2 rounded-full',
 isConnected ? 'bg-green-500' : 'bg-red-500'
 )} />
 <span className="text-xs text-muted-foreground">
 {isConnected ? 'Онлайн' : 'Оффлайн'}
 </span>
 {unreadCount > 0 && (
 <Button
 size="sm"
 variant="outline"
 onClick={markAllAsRead}
 className="text-xs"
 >
 Отметить все
 </Button>
 )}
 </div>
 </div>
 </CardHeader>

 <CardContent className="p-0">
 <ScrollArea className="h-96">
 {filteredNotifications.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-8 px-4">
 <Bell className="h-12 w-12 text-muted-foreground mb-4" />
 <p className="text-muted-foreground text-center">
 {showUnreadOnly ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
 </p>
 </div>
 ) : (
 <div className="space-y-1 p-2">
 {filteredNotifications.map((notification) => (
 <div
 key={notification.id}
 className={cn(
 'relative p-3 rounded-lg border transition-colors',
 notification.read
 ? 'bg-background border-border'
 : getNotificationColor(notification.level),
 'hover:bg-accent/50'
 )}
 >
 <div className="flex items-start gap-3">
 <div className="flex-shrink-0 mt-0.5">
 {getNotificationIcon(notification.type, notification.level)}
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1">
 <h4 className="text-sm font-medium truncate">
 {notification.title}
 </h4>
 <div className="flex items-center gap-1">
 {!notification.read && (
 <div className="w-2 h-2 bg-blue-500 rounded-full" />
 )}
 <Button
 size="sm"
 variant="outline"
 onClick={() => deleteNotification(notification.id)}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
 <X className="h-3 w-3" />
 </Button>
 </div>
 </div>

 <p className="text-sm text-muted-foreground mb-2">
 {notification.message}
 </p>

 <div className="flex items-center justify-between">
 <span className="text-xs text-muted-foreground">
 {notification.timestamp.toLocaleString()}
 </span>

 {notification.actionUrl && notification.actionText && (
 <Button
 size="sm"
 variant="outline"
 asChild
 className="text-xs h-6"
 >
 <a href={notification.actionUrl}>
 {notification.actionText}
 </a>
 </Button>
 )}

 {!notification.read && (
 <Button
 size="sm"
 variant="outline"
 onClick={() => markAsRead(notification.id)}
 className="text-xs h-6 gap-1"
 >
 <Check className="h-3 w-3" />
 Прочитано
 </Button>
 )}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </ScrollArea>
 </CardContent>
 </Card>
 )
}
