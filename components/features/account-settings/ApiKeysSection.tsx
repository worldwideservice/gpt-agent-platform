'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Copy, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface ApiKey {
  id: string
  name: string
  key: string
  description?: string
  createdAt: string
  lastUsedAt?: string | null
  expiresAt?: string | null
}

export function ApiKeysSection() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    description: '',
    expiresAt: '',
  })
  const [revealedKey, setRevealedKey] = useState<string | null>(null)

  // Загрузка API ключей
  useEffect(() => {
    fetch('/api/api-keys')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApiKeys(data)
        }
      })
      .catch(() => {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить API ключи',
          variant: 'destructive',
        })
      })
      .finally(() => setIsFetching(false))
  }, [toast])

  const handleCreateKey = async () => {
    if (!newKeyData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название ключа',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create API key')
      }

      const newKey = await res.json()

      // Показать полный ключ (только один раз)
      setRevealedKey(newKey.key)

      // Добавить в список с замаскированным ключом
      setApiKeys([
        ...apiKeys,
        {
          ...newKey,
          key: `${newKey.key.substring(0, 12)}****************************${newKey.key.slice(-3)}`,
        },
      ])

      toast({
        title: 'API ключ создан',
        description: 'Сохраните ключ в безопасном месте. Вы не сможете увидеть его снова.',
      })

      // Очистить форму
      setNewKeyData({ name: '', description: '', expiresAt: '' })
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: 'Скопировано',
      description: 'API ключ скопирован в буфер обмена',
    })
  }

  const handleDeleteKey = async (keyId: string) => {
    // [MOCK] В реальном проекте - DELETE запрос к API
    setApiKeys(apiKeys.filter((k) => k.id !== keyId))
    toast({
      title: 'Ключ удален',
      description: 'API ключ был успешно удален',
    })
  }

  const closeDialogAndReset = () => {
    setIsDialogOpen(false)
    setRevealedKey(null)
  }

  if (isFetching) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Ключи</CardTitle>
            <CardDescription>Управление API ключами для интеграции</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Создать ключ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новый API ключ</DialogTitle>
                <DialogDescription>
                  Ключ будет показан только один раз. Сохраните его в безопасном месте.
                </DialogDescription>
              </DialogHeader>

              {revealedKey ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <Label className="mb-2 block text-sm font-medium">Ваш новый API ключ</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 break-all rounded bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
                        {revealedKey}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyKey(revealedKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      ⚠️ Сохраните этот ключ сейчас. Вы не сможете увидеть его снова.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={closeDialogAndReset}>Готово</Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Название</Label>
                    <Input
                      id="keyName"
                      placeholder="Production Key"
                      value={newKeyData.name}
                      onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyDescription">Описание (опционально)</Label>
                    <Textarea
                      id="keyDescription"
                      placeholder="Для продакшен сервера"
                      value={newKeyData.description}
                      onChange={(e) =>
                        setNewKeyData({ ...newKeyData, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyExpiry">Дата истечения (опционально)</Label>
                    <Input
                      id="keyExpiry"
                      type="datetime-local"
                      value={newKeyData.expiresAt}
                      onChange={(e) => setNewKeyData({ ...newKeyData, expiresAt: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleCreateKey} disabled={isLoading}>
                      {isLoading ? 'Создание...' : 'Создать ключ'}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>У вас пока нет API ключей</p>
            <p className="mt-1 text-sm">Создайте первый ключ для интеграции</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-start justify-between rounded-lg border p-4 dark:border-gray-700"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{key.name}</h4>
                    {key.expiresAt && new Date(key.expiresAt) < new Date() && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                        Истек
                      </span>
                    )}
                  </div>
                  {key.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{key.description}</p>
                  )}
                  <code className="block font-mono text-sm text-gray-700 dark:text-gray-300">
                    {key.key}
                  </code>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Создан: {new Date(key.createdAt).toLocaleDateString('ru-RU')}</span>
                    {key.lastUsedAt && (
                      <span>
                        Последнее использование: {new Date(key.lastUsedAt).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                    {key.expiresAt && (
                      <span>
                        Истекает: {new Date(key.expiresAt).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteKey(key.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
