'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileText,
  BarChart3,
  Database,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Job {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: {
    current: number
    total: number
    message: string
  }
  result?: any
  error?: string
  duration?: number
  created_at: string
  started_at?: string
  completed_at?: string
  failed_at?: string
}

interface JobManagerProps {
  className?: string
  showCreateJob?: boolean
  onJobCreate?: (jobType: string, payload: any) => void
}

const jobTypeIcons = {
  'file_processing': FileText,
  'report_generation': BarChart3,
  'bulk_processing': Database,
  'model_finetuning': Zap,
}

const jobTypeLabels = {
  'file_processing': 'Обработка файла',
  'report_generation': 'Генерация отчета',
  'bulk_processing': 'Массовые операции',
  'model_finetuning': 'Тонкая настройка модели',
}

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
}

export const JobManager = ({ className, showCreateJob, onJobCreate }: JobManagerProps) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchJobs()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/status?limit=20')
      if (!response.ok) throw new Error('Failed to fetch jobs')

      const data = await response.json()
      setJobs(data.jobs || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleRetryJob = async (jobId: string) => {
    try {
      // This would call an API to retry the job
      console.log('Retrying job:', jobId)
    } catch (err) {
      console.error('Failed to retry job:', err)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      // This would call an API to delete the job
      console.log('Deleting job:', jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err) {
      console.error('Failed to delete job:', err)
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '-'
    const seconds = Math.round(duration / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default: return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Загрузка задач...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Background Tasks</h2>
        {showCreateJob && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create Job'}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {showCreateForm && onJobCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Job</CardTitle>
            <CardDescription>Start a background processing task</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Job creation form would go here */}
              <p className="text-sm text-muted-foreground">Job creation form coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No background jobs yet</p>
                <p className="text-sm text-muted-foreground">Heavy processing tasks will appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => {
            const Icon = jobTypeIcons[job.type as keyof typeof jobTypeIcons] || FileText
            const label = jobTypeLabels[job.type as keyof typeof jobTypeLabels] || job.type

            return (
              <Card key={job.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{label}</CardTitle>
                        <CardDescription className="text-sm">
                          ID: {job.id.slice(0, 8)}...
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <Badge variant="outline" className={cn('capitalize', statusColors[job.status])}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {job.progress && job.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{job.progress.message}</span>
                        <span>{job.progress.current}/{job.progress.total}</span>
                      </div>
                      <Progress
                        value={(job.progress.current / job.progress.total) * 100}
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created: {new Date(job.created_at).toLocaleString()}</span>
                    {job.duration && (
                      <span>Duration: {formatDuration(job.duration)}</span>
                    )}
                  </div>

                  {job.error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
                      {job.error}
                    </div>
                  )}

                  {job.result && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(job.result, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {job.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetryJob(job.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
