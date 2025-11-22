'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  useToast,
} from '@/components/ui'

interface AgentCopyButtonProps {
  agentId: string
  agentName: string
  tenantId: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
}

export function AgentCopyButton({
  agentId,
  agentName,
  tenantId,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
}: AgentCopyButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = async () => {
    setIsCopying(true)

    try {
      const response = await fetch(`/api/agents/${agentId}/copy`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to copy agent')
      }

      toast({
        title: 'Агент скопирован',
        description: `Создана копия агента "${agentName}"`,
        variant: 'success',
      })

      // Refresh the page to show the new copied agent
      router.refresh()
    } catch (error) {
      console.error('Error copying agent:', error)
      toast({
        title: 'Ошибка копирования',
        description: error instanceof Error ? error.message : `Не удалось скопировать агента "${agentName}"`,
        variant: 'error',
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} aria-label="Копировать агента">
          <Copy className={showLabel ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
          {showLabel && 'Копировать'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Copy className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle>Скопировать агента ИИ?</AlertDialogTitle>
          <AlertDialogDescription>
            Дублирует все настройки. Копия агента будет неактивна, пока вы не включите её.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCopying}>Отменить</AlertDialogCancel>
          <AlertDialogAction onClick={handleCopy} disabled={isCopying}>
            {isCopying ? 'Копирование...' : 'Подтвердить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
