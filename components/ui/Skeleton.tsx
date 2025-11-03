import { cn } from '@/lib/utils'

interface SkeletonProps {
 className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
 return (
 <div
 className={cn(
 'animate-pulse rounded-md bg-muted',
 className
 )}
 />
 )
}

// Specific skeleton components for different content types

export const SkeletonCard = ({ className }: SkeletonProps) => {
 return (
 <div className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}>
 <div className="space-y-4">
 <Skeleton className="h-4 w-3/4" />
 <Skeleton className="h-4 w-1/2" />
 <div className="space-y-2">
 <Skeleton className="h-3 w-full" />
 <Skeleton className="h-3 w-4/5" />
 <Skeleton className="h-3 w-2/3" />
 </div>
 </div>
 </div>
 )
}

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => {
 return (
 <div className="space-y-3">
 {/* Table header */}
 <div className="flex space-x-4">
 {Array.from({ length: cols }).map((_, i) => (
 <Skeleton key={i} className="h-4 flex-1" />
 ))}
 </div>

 {/* Table rows */}
 {Array.from({ length: rows }).map((_, rowIndex) => (
 <div key={rowIndex} className="flex space-x-4">
 {Array.from({ length: cols }).map((_, colIndex) => (
 <Skeleton key={colIndex} className="h-8 flex-1" />
 ))}
 </div>
 ))}
 </div>
 )
}

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => {
 return (
 <div className="space-y-2">
 {Array.from({ length: lines }).map((_, i) => (
 <Skeleton
 key={i}
 className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
 />
 ))}
 </div>
 )
}

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
 const sizeClasses = {
 sm: 'h-8 w-8',
 md: 'h-10 w-10',
 lg: 'h-12 w-12',
 }

 return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />
}

export const SkeletonButton = ({ className }: SkeletonProps) => {
 return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />
}

export const SkeletonInput = ({ className }: SkeletonProps) => {
 return <Skeleton className={cn('h-10 w-full rounded-md', className)} />
}

// Loading overlay component
interface LoadingOverlayProps {
 isLoading: boolean
 children: React.ReactNode
 className?: string
}

export const LoadingOverlay = ({ isLoading, children, className }: LoadingOverlayProps) => {
 if (!isLoading) return <>{children}</>

 return (
 <div className={cn('relative', className)}>
 {children}
 <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-md">
 <div className="flex items-center space-x-2">
 <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
 <span className="text-sm text-muted-foreground">Загрузка...</span>
 </div>
 </div>
 </div>
 )
}

// Page loading skeleton
export const PageSkeleton = () => {
 return (
 <div className="space-y-6">
 {/* Header skeleton */}
 <div className="space-y-2">
 <Skeleton className="h-8 w-1/3" />
 <Skeleton className="h-4 w-1/2" />
 </div>

 {/* Content skeleton */}
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 <SkeletonCard />
 <SkeletonCard />
 <SkeletonCard />
 </div>

 {/* Table skeleton */}
 <div className="space-y-4">
 <Skeleton className="h-6 w-1/4" />
 <SkeletonTable rows={8} cols={5} />
 </div>
 </div>
 )
}

// Dashboard loading skeleton
export const DashboardSkeleton = () => {
 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div className="space-y-2">
 <Skeleton className="h-8 w-48" />
 <Skeleton className="h-4 w-64" />
 </div>
 <SkeletonAvatar />
 </div>

 {/* Stats cards */}
 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 {Array.from({ length: 4 }).map((_, i) => (
 <div key={i} className="rounded-lg border bg-card p-6">
 <div className="flex items-center justify-between">
 <Skeleton className="h-4 w-20" />
 <Skeleton className="h-8 w-8 rounded-full" />
 </div>
 <Skeleton className="mt-4 h-8 w-16" />
 <Skeleton className="mt-2 h-3 w-24" />
 </div>
 ))}
 </div>

 {/* Charts */}
 <div className="grid gap-4 md:grid-cols-2">
 <div className="rounded-lg border bg-card p-6">
 <Skeleton className="h-6 w-32 mb-4" />
 <Skeleton className="h-64 w-full" />
 </div>
 <div className="rounded-lg border bg-card p-6">
 <Skeleton className="h-6 w-32 mb-4" />
 <Skeleton className="h-64 w-full" />
 </div>
 </div>
 </div>
 )
}
