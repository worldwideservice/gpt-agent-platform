// UI Components Library
// Главный экспорт всех компонентов проекта

// Shadcn UI компоненты (основная библиотека)
export * from './shadcn'

// Breadcrumb компоненты
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb'

// Progress компонент
export { Progress } from './progress'

// Accordion компоненты
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion'

// Separator компонент
export { Separator } from './separator'

// Alert Dialog компоненты
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'

// Logo компоненты
export { Logo, LogoCompact } from './Logo'

// Дополнительные компоненты
export { Toggle } from './Toggle'

// Legacy aliases for backward compatibility
export { Button } from './shadcn'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './shadcn'
export { Input } from './shadcn'
export { Textarea } from './shadcn'
export { Badge } from './shadcn'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from './shadcn'
export { Switch } from './switch'
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './shadcn'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './shadcn'
export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from './shadcn'

// Label компонент
export { Label } from './label'

// Toast компоненты
export { ToastProvider, useToast } from './toast-context'
export { ToastViewport } from './toast-viewport'

// Confirm Dialog компонент
export { ConfirmDialog } from './ConfirmDialog'

// Dialog компоненты
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'

// Popover компоненты
export {
 Popover,
 PopoverTrigger,
 PopoverContent,
 PopoverAnchor,
} from './popover'

// Layout компоненты
export { Sidebar } from '../layout/Sidebar'
export { Header } from '../layout/Header'

// CRM компоненты
export { CRMSync } from '../crm/CRMSync'
export { ChannelsSettings } from '../crm/ChannelsSettings'
export { KnowledgeBaseSettings } from '../crm/KnowledgeBaseSettings'
export { InteractionSettings } from '../crm/InteractionSettings'
export { CRMSelector } from '../crm/CRMSelector'
export { UniversalSync } from '../crm/UniversalSync'
export { KommoSetup } from '../crm/KommoSetup'
export { KommoAPIDebugger } from '../crm/KommoAPIDebugger'

// Dashboard компоненты
export { StatCard } from '../dashboard/StatCard'
