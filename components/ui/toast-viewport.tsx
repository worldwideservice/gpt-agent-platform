'use client'

import { useToast } from './toast-context'
import { ToastItem } from './toast-item'

export const ToastViewport = () => {
 const { toasts, dismiss } = useToast()

 if (toasts.length === 0) {
 return null
 }

 return (
 <div
 className="pointer-events-none fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col items-end gap-3 p-4 sm:max-w-md"
 aria-live="polite"
 aria-label="Уведомления"
 >
 {toasts.map((toast) => (
 <ToastItem
 key={toast.id}
 id={toast.id}
 title={toast.title}
 description={toast.description}
 variant={toast.variant}
 duration={toast.duration}
 onDismiss={dismiss}
 />
 ))}
 </div>
 )
}
