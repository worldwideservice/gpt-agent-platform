'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toast-context'

import type { Agent } from '@/types'

const CreateAgentPage = () => {
  const router = useRouter()
  const { push: pushToast } = useToast()
  const [agentName, setAgentName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleBack = () => {
    router.push('/agents')
  }

  const handleSubmit = (mode: 'create' | 'createAndNew') => {
    if (!agentName.trim()) {
      setError('Название агента обязательно')
      return
    }

    startTransition(async () => {
      setError(null)

      try {
        const response = await fetch('/api/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: agentName.trim(),
            status: 'draft',
          }),
        })

        const payload = (await response.json()) as { success: boolean; data?: Agent; error?: string }

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? 'Не удалось создать агента')
        }

        pushToast({
          title: 'Агент создан',
          description: `«${payload.data.name}» добавлен в список агентов`,
          variant: 'success',
        })

        if (mode === 'create') {
          router.push(`/agents/${payload.data.id}`)
          return
        }

        setAgentName('')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Не удалось создать агента'
        console.error('Failed to create agent', err)
        setError(message)
        pushToast({
          title: 'Ошибка создания агента',
          description: message,
          variant: 'error',
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Агенты ИИ</span>
            <span>›</span>
            <span>Создать</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Создать Агент ИИ</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Профиль агента</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              placeholder=""
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              autoFocus
              disabled={isPending}
            />
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => handleSubmit('create')} 
              disabled={!agentName.trim() || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Создание...
                </>
              ) : (
                'Создать'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('createAndNew')}
              disabled={!agentName.trim() || isPending}
            >
              Создать и создать ещё
            </Button>
            <Button variant="outline" onClick={handleBack} disabled={isPending}>
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateAgentPage
