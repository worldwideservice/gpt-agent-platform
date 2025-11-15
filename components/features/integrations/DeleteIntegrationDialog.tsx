'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteIntegration } from '@/lib/hooks'

interface DeleteIntegrationDialogProps {
  isOpen: boolean
  onClose: () => void
  integrationId: string
  integrationName: string
  agentId: string
}

export function DeleteIntegrationDialog({
  isOpen,
  onClose,
  integrationId,
  integrationName,
  agentId,
}: DeleteIntegrationDialogProps) {
  const { mutate: deleteIntegration, isPending } = useDeleteIntegration(agentId)

  const handleDelete = () => {
    deleteIntegration(integrationId, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить интеграцию?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы действительно хотите удалить интеграцию "{integrationName}"? Это действие нельзя отменить.
            Все настройки интеграции будут удалены.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
