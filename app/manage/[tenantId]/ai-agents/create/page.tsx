'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'
import { useTenant } from '@/components/providers/TenantProvider'

export default function CreateAgentPage() {
  const router = useRouter()
  const { tenantId } = useTenant()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Название обязательно для заполнения')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tenants/${tenantId}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      const agent = await response.json()

      // Redirect to the agent edit page
      router.push(`/manage/${tenantId}/ai-agents/${agent.id}/edit`)
    } catch (err) {
      setError('Не удалось создать агента. Попробуйте еще раз.')
      console.error('Error creating agent:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${tenantId}/ai-agents`}>Агенты ИИ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Создать</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Создать Агент ИИ
        </h1>
      </header>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="agent-name">
                Название <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="agent-name"
                type="text"
                placeholder="Введите название агента"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className={error ? 'border-rose-500' : ''}
              />
              {error && (
                <p className="text-sm text-rose-500">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
