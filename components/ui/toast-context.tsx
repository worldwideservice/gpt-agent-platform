'use client'

import { createContext, useContext, useMemo, useState } from 'react'

interface ToastMessage {
 id: string
 title: string
 description?: string
 variant?: 'default' | 'success' | 'error'
 duration?: number
}

type ToastContextValue = {
 toasts: ToastMessage[]
 push: (toast: Omit<ToastMessage, 'id'>) => void
 dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION = 4000

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
 const [toasts, setToasts] = useState<ToastMessage[]>([])

 const value = useMemo<ToastContextValue>(() => {
 const push = (toast: Omit<ToastMessage, 'id'>) => {
 const id = crypto.randomUUID()
 const toastWithId: ToastMessage = {
 id,
 variant: 'default',
 duration: DEFAULT_DURATION,
 ...toast,
 }

 setToasts((prev) => [...prev, toastWithId])

 if (toastWithId.duration && toastWithId.duration > 0) {
 setTimeout(() => {
 setToasts((prev) => prev.filter((item) => item.id !== id))
 }, toastWithId.duration)
 }
 }

 const dismiss = (id: string) => {
 setToasts((prev) => prev.filter((item) => item.id !== id))
 }

 return { toasts, push, dismiss }
 }, [toasts])

 return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
 const context = useContext(ToastContext)

 if (!context) {
 throw new Error('useToast must be used within ToastProvider')
 }

 return context
}
