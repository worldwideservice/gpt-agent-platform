"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
 extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
 label?: string
 description?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 ({ className, label, description, ...props }, ref) => {
 const textarea = (
 <textarea
 className={cn(
 "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
 className
 )}
 ref={ref}
 {...props}
 />
 )

 if (label) {
 return (
 <div className="space-y-2">
 <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 {label}
 </label>
 {textarea}
 {description && (
 <p className="text-sm text-muted-foreground">{description}</p>
 )}
 </div>
 )
 }

 return textarea
 }
)
Textarea.displayName = "Textarea"

export { Textarea }