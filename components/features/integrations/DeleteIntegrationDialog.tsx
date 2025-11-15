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

/**
 * Props for the DeleteIntegrationDialog component
 */
interface DeleteIntegrationDialogProps {
  /** Whether the dialog is currently open */
  isOpen: boolean
  /** Callback to close the dialog */
  onClose: () => void
  /** ID of the integration to delete */
  integrationId: string
  /** Display name of the integration (shown in confirmation message) */
  integrationName: string
  /** ID of the agent this integration belongs to */
  agentId: string
}

/**
 * Confirmation dialog for deleting an integration
 *
 * Displays a warning message and requires user confirmation before deleting
 * the integration. Uses a destructive action style (red button) to indicate
 * the irreversible nature of the action.
 *
 * Features:
 * - Clear warning about irreversible action
 * - Disabled buttons during deletion (prevents double-clicks)
 * - Automatic dialog close on successful deletion
 * - Toast notification via useDeleteIntegration hook
 *
 * @component
 * @example
 * ```tsx
 * const [isDeleteOpen, setIsDeleteOpen] = useState(false)
 * const [toDelete, setToDelete] = useState(null)
 *
 * <DeleteIntegrationDialog
 *   isOpen={isDeleteOpen}
 *   onClose={() => setIsDeleteOpen(false)}
 *   integrationId={toDelete.id}
 *   integrationName={toDelete.name}
 *   agentId={agent.id}
 * />
 * ```
 */
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
