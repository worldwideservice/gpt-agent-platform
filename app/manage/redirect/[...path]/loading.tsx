import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Loading state для redirect страницы
 * Показывается во время получения tenant-id и выполнения редиректа
 */
export default function RedirectLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-6 p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

