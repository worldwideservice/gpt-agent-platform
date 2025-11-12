'use client'

import { useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from '@/components/ui'

interface KnowledgeUploadPanelProps {
  agents: Array<{ id: string; name: string }>
}

export function KnowledgeUploadPanel({ agents }: KnowledgeUploadPanelProps) {
  const [agentId, setAgentId] = useState(agents[0]?.id ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!agentId || !file) {
      setMessage('Выберите агента и файл для загрузки')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setIsUploading(true)
      setMessage(null)
      const response = await fetch(`/api/agents/${agentId}/assets`, {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить файл')
      }

      setMessage('Файл загружен и отправлен на обработку')
      setFile(null)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ошибка загрузки файла')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleUpload}>
        <CardHeader>
          <CardTitle>Загрузка знаний</CardTitle>
          <CardDescription>Прикрепите документ, чтобы обогатить базу знаний агента.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Агент</Label>
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={agentId}
              onChange={(event) => setAgentId(event.target.value)}
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="knowledge-file">Файл</Label>
            <Input
              id="knowledge-file"
              type="file"
              accept=".pdf,.docx,.txt,.md,.html"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-gray-500">Поддерживаются PDF, DOCX, TXT, Markdown и HTML до 50 МБ.</p>
          </div>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading || !agentId || !file}>
            {isUploading ? 'Загрузка…' : 'Загрузить'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
