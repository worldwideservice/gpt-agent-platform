import { cn } from "@/lib/utils"

export interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  className
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(true)
  }

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  }

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900"
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
          sideClasses[side],
          className
        )}>
          {content}
          {/* Arrow */}
          <div className={cn(
            "absolute w-0 h-0 border-4 border-transparent",
            arrowClasses[side]
          )} />
        </div>
      )}
    </div>
  )
}

export { Tooltip }
