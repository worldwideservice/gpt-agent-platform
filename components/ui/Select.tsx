import * as React from 'react'
import {
 Select as ShadcnSelect,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from './shadcn/select'

export interface SelectProps {
 label?: string
 options: { value: string; label: string }[]
 value?: string
 defaultValue?: string
 onChange?: (value: string) => void
 onValueChange?: (value: string) => void
 placeholder?: string
 disabled?: boolean
 required?: boolean
 className?: string
 id?: string
 'aria-label'?: string
}

export const Select = React.memo(React.forwardRef<
 React.ElementRef<typeof ShadcnSelect>,
 SelectProps
>(({
 label,
 options,
 value,
 defaultValue,
 onChange,
 onValueChange,
 placeholder = 'Выберите...',
 disabled,
 required,
 className,
 id,
 'aria-label': ariaLabel,
 ...props
}, ref) => {
 const handleValueChange = (newValue: string) => {
 onValueChange?.(newValue)
 onChange?.(newValue)
 }

 return (
 <div className="space-y-2">
 {label && (
 <label htmlFor={id} className="text-sm font-medium block">
 {label}
 {required && <span className="text-red-500 ml-1">*</span>}
 </label>
 )}
 <ShadcnSelect
 value={value}
 defaultValue={defaultValue}
 onValueChange={handleValueChange}
 disabled={disabled}
 required={required}
 {...props}
 >
 <SelectTrigger
 id={id}
 className={className}
 aria-label={ariaLabel}
 >
 <SelectValue placeholder={placeholder} />
 </SelectTrigger>
 <SelectContent>
 {options.map((option) => (
 <SelectItem key={option.value} value={option.value}>
 {option.label}
 </SelectItem>
 ))}
 </SelectContent>
 </ShadcnSelect>
 </div>
 )
}))

Select.displayName = 'Select'

// Re-export shadcn components for direct usage when needed
export {
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from './shadcn/select'

// Legacy alias for backward compatibility
export { ShadcnSelect as SelectPrimitive }
