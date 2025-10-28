import { cn } from "@/lib/utils"

export interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  size = "md"
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export { Progress }
