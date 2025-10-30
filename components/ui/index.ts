// UI Components Library
// Главный экспорт всех компонентов проекта

// Shadcn UI компоненты (основная библиотека)
export * from './shadcn'

// Дополнительные компоненты
export { Toggle } from './Toggle'

// Legacy aliases for backward compatibility
export { Button } from './shadcn'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './shadcn'
export { Input } from './shadcn'
export { Textarea } from './shadcn'
export { Badge } from './shadcn'
export { Select } from './shadcn'
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './shadcn'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './shadcn'
export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from './shadcn'

// Layout компоненты
export { Sidebar } from '../layout/Sidebar'
export { Header } from '../layout/Header'

// Agent компоненты
export { AgentTable } from '../agents/AgentTable'
export { TriggerManager } from '../agents/TriggerManager'

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
