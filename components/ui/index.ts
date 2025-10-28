// UI Components Library
// Главный экспорт всех компонентов проекта

// Существующие компоненты
export { Button } from './Button'
export { Card } from './Card'
export { Input } from './Input'
export { Select } from './Select'
export { Textarea } from './Textarea'
export { Table } from './Table'
export { Modal } from './Modal'
export { Badge } from './Badge'
export { Tabs } from './Tabs'
export { Toggle } from './Toggle'

// Shadcn компоненты
export * from './shadcn'

// Magic компоненты  
export * from './magic'

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

// Dashboard компоненты
export { StatCard } from '../dashboard/StatCard'
