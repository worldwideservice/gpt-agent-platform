'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
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

interface AgentDeleteButtonProps {
  agentId: string
  agentName: string
  tenantId: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
}

export function AgentDeleteButton({
  agentId,
  agentName,
  tenantId,
  variant = 'destructive',
  size = 'default',
  showLabel = true,
}: AgentDeleteButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/tenants/${tenantId}/agents/${agentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete agent')
      }

      toast({
        title: 'Агент удален',
        description: `Агент "${agentName}" успешно удален`,
        variant: 'success',
      })

      // Redirect to agents list after successful deletion
      router.push(`/manage/${tenantId}/ai-agents`)
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast({
        title: 'Ошибка удаления',
        description: `Не удалось удалить агента "${agentName}"`,
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} aria-label="Удалить агента">
          <Trash2 className={showLabel ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
          {showLabel && 'Удалить'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить агента ИИ?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить агента <strong>{agentName}</strong>?
            Это действие нельзя будет отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
