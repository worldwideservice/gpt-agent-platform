'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Mail,
  Calendar
} from 'lucide-react'
import { UserRepository } from '@/lib/repositories/users'
import type { User } from '@/types/user'

interface UserWithSubscription extends User {
  subscription?: {
    status: string
    currentPeriodEnd: Date
  }
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const userList = await UserRepository.getUsers(100, 0)
      setUsers(userList as UserWithSubscription[])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === 'all' || user.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const handleUpdateUserTier = async (userId: string, newTier: string) => {
    try {
      const success = await UserRepository.updateUserTier(userId, newTier as any)
      if (success) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, tier: newTier as any } : user
        ))
      }
    } catch (error) {
      console.error('Failed to update user tier:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return
    }

    try {
      // This would be a soft delete
      console.log('Deleting user:', userId)
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-500'
      case 'premium': return 'bg-blue-500'
      case 'vip': return 'bg-purple-500'
      default: return 'bg-gray-400'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Управление пользователями</h2>
          <p className="text-muted-foreground">
            Просмотр и управление пользователями платформы
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск пользователей</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Email или имя..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="tier-filter">Тариф</Label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все тарифы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все тарифы</SelectItem>
                  <SelectItem value="free">Бесплатный</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Пользователи ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Всего пользователей: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Тариф</TableHead>
                <TableHead>Подписка</TableHead>
                <TableHead>Регистрация</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'Без имени'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getTierBadgeColor(user.tier)} text-white`}>
                      {user.tier.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.subscription ? (
                      <div className="text-sm">
                        <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
                          {user.subscription.status}
                        </Badge>
                        {user.subscription.currentPeriodEnd && (
                          <div className="text-xs text-muted-foreground mt-1">
                            до {formatDate(user.subscription.currentPeriodEnd)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Нет подписки</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateUserTier(user.id, 'free')}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Сделать бесплатным
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateUserTier(user.id, 'premium')}>
                          <Shield className="h-4 w-4 mr-2" />
                          Сделать премиум
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateUserTier(user.id, 'vip')}>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Сделать VIP
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать пользователя</DialogTitle>
              <DialogDescription>
                Изменить настройки пользователя {selectedUser.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-tier">Тариф</Label>
                <Select
                  value={selectedUser.tier}
                  onValueChange={(value) => setSelectedUser({...selectedUser, tier: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Бесплатный</SelectItem>
                    <SelectItem value="premium">Премиум</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Отмена
              </Button>
              <Button onClick={() => {
                handleUpdateUserTier(selectedUser.id, selectedUser.tier)
                setShowEditDialog(false)
              }}>
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
