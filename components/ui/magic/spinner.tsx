import { cn } from "@/lib/utils"

export interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  color?: "primary" | "secondary" | "gray"
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className,
  color = "primary"
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    gray: "text-gray-400"
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-gray-300 border-t-transparent",
      sizeClasses[size],
      colorClasses[color],
      className
    )} />
  )
}

export { Spinner }
