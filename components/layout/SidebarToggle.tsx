'use client'

import { useState, useEffect } from 'react'
import { createContext, useContext } from 'react'

interface SidebarContextType {
 isOpen: boolean
 toggle: () => void
 open: () => void
 close: () => void
 collapsedGroups: string[]
 groupIsCollapsed: (label: string) => boolean
 toggleCollapsedGroup: (label: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
 const context = useContext(SidebarContext)
 if (!context) {
 throw new Error('useSidebar must be used within SidebarProvider')
 }
 return context
}

interface SidebarProviderProps {
 children: React.ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
 const [isOpen, setIsOpen] = useState(false)
 const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])

 const toggle = () => setIsOpen((prev) => !prev)
 const open = () => setIsOpen(true)
 const close = () => setIsOpen(false)

 const groupIsCollapsed = (label: string) => {
 return collapsedGroups.includes(label)
 }

 const toggleCollapsedGroup = (label: string) => {
 setCollapsedGroups((prev) => {
 if (prev.includes(label)) {
 return prev.filter((g) => g !== label)
 }
 return [...prev, label]
 })
 }

 useEffect(() => {
 const handleResize = () => {
 if (window.innerWidth >= 1024) {
 setIsOpen(false)
 }
 }

 window.addEventListener('resize', handleResize)
 return () => window.removeEventListener('resize', handleResize)
 }, [])

 return (
 <SidebarContext.Provider
 value={{
 isOpen,
 toggle,
 open,
 close,
 collapsedGroups,
 groupIsCollapsed,
 toggleCollapsedGroup,
 }}
 >
 {children}
 </SidebarContext.Provider>
 )
}

