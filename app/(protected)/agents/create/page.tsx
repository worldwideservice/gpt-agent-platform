'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const CreateAgentPage = () => {
  const router = useRouter()
  const [agentName, setAgentName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleBack = () => {
    router.push('/agents')
  }

  const handleCreate = async () => {
    if (!agentName.trim()) return

    setIsSaving(true)
    // Здесь будет логика сохранения
    setTimeout(() => {
      setIsSaving(false)
      router.push('/agents/553/edit')
    }, 800)
  }

  const handleCreateAndNew = async () => {
    if (!agentName.trim()) return

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setAgentName('')
    }, 800)
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
              Название
            </label>
            <Input
              placeholder=""
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleCreate} 
              disabled={!agentName.trim() || isSaving}
            >
              {isSaving ? 'Создание...' : 'Создать'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCreateAndNew}
              disabled={!agentName.trim() || isSaving}
            >
              Создать и Создать еще
            </Button>
            <Button variant="outline" onClick={handleBack}>
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateAgentPage

