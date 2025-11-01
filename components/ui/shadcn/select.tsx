import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  description?: string
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLSelectElement>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, description, options, placeholder, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        // Support both string and event handlers
        const onChangeFn = onChange as any
        if (onChangeFn.length === 1) {
          // String handler: (value: string) => void
          onChangeFn(e.target.value)
        } else {
          // Event handler: (event: ChangeEvent) => void
          onChangeFn(e)
        }
      }
    }

    const select = (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
    )

    if (label) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
          {select}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )
    }

    return select
  }
)
Select.displayName = "Select"

export { Select }
