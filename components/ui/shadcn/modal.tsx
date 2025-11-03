"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "../dialog"

// Modal компонент - алиас для Dialog с удобным API
interface ModalProps {
 open?: boolean
 onOpenChange?: (open: boolean) => void
 children: React.ReactNode
}

const Modal = ({ open, onOpenChange, children }: ModalProps) => {
 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 {children}
 </Dialog>
 )
}

const ModalTrigger = DialogTrigger

const ModalContent = DialogContent

const ModalHeader = DialogHeader

const ModalFooter = DialogFooter

const ModalTitle = DialogTitle

const ModalDescription = DialogDescription

export {
 Modal,
 ModalTrigger,
 ModalContent,
 ModalHeader,
 ModalFooter,
 ModalTitle,
 ModalDescription,
}

export type { ModalProps }

