/**
 * Progress Indicator Component
 * For showing progress of long-running operations
 */

'use client'

import { useEffect, useState } from 'react'
import { Progress } from './progress'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Spinner } from './spinner'

interface ProgressIndicatorProps {
  /** Current progress (0-100) */
  value?: number
  /** Operation title */
  title?: string
  /** Current step description */
  description?: string
  /** Show indeterminate progress */
  indeterminate?: boolean
  /** Show as inline (no card wrapper) */
  inline?: boolean
  /** Estimated time remaining in seconds */
  estimatedTime?: number
}

export function ProgressIndicator({
  value = 0,
  title = 'Processing...',
  description,
  indeterminate = false,
  inline = false,
  estimatedTime,
}: ProgressIndicatorProps) {
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime)

  useEffect(() => {
    if (!estimatedTime) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (!prev || prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [estimatedTime])

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {indeterminate && <Spinner className="h-5 w-5" />}
          <div>
            <h3 className="font-medium">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {!indeterminate && <span className="text-sm font-medium">{value}%</span>}
      </div>

      <Progress value={indeterminate ? undefined : value} className="h-2" />

      {timeRemaining !== undefined && timeRemaining > 0 && (
        <p className="text-xs text-muted-foreground">
          Estimated time remaining: {formatTime(timeRemaining)}
        </p>
      )}
    </div>
  )

  if (inline) {
    return content
  }

  return (
    <Card>
      <CardContent className="pt-6">{content}</CardContent>
    </Card>
  )
}

/**
 * Multi-Step Progress Indicator
 * For showing progress through multiple steps
 */
interface Step {
  id: string
  label: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
}

interface MultiStepProgressProps {
  steps: Step[]
  currentStep?: number
}

export function MultiStepProgress({ steps, currentStep = 0 }: MultiStepProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Processing Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-6 border-l-2 border-border pl-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = step.status === 'completed'
            const isError = step.status === 'error'
            const isPending = step.status === 'pending'

            return (
              <li key={step.id} className="relative">
                {/* Step indicator */}
                <div
                  className={`absolute -left-[1.6rem] flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isError
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-border bg-background'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isError ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : isActive ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {/* Step content */}
                <div className="space-y-1">
                  <h4
                    className={`font-medium ${
                      isActive ? 'text-foreground' : isPending ? 'text-muted-foreground' : ''
                    }`}
                  >
                    {step.label}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}

/**
 * Upload Progress Component
 * Specialized for file uploads
 */
interface UploadProgressProps {
  fileName: string
  fileSize: number
  uploadedBytes: number
  speed?: number // bytes per second
}

export function UploadProgress({ fileName, fileSize, uploadedBytes, speed }: UploadProgressProps) {
  const progress = Math.round((uploadedBytes / fileSize) * 100)
  const remaining = fileSize - uploadedBytes
  const estimatedTime = speed ? remaining / speed : undefined

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <h4 className="font-medium">{fileName}</h4>
              <p className="text-sm text-muted-foreground">
                {formatBytes(uploadedBytes)} / {formatBytes(fileSize)}
                {speed && <span className="ml-2">({formatBytes(speed)}/s)</span>}
              </p>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>

          <Progress value={progress} className="h-2" />

          {estimatedTime && estimatedTime > 0 && (
            <p className="text-xs text-muted-foreground">
              {formatTime(Math.ceil(estimatedTime))} remaining
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions
function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
