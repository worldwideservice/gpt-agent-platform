# Детальная структура проекта с примерами кода

> Дополнительный документ с примерами кода для ключевых файлов структуры

## 📋 Содержание

1. [Примеры layout файлов](#примеры-layout-файлов)
2. [Примеры page файлов](#примеры-page-файлов)
3. [Примеры API routes](#примеры-api-routes)
4. [Примеры компонентов](#примеры-компонентов)
5. [Примеры сервисов](#примеры-сервисов)
6. [Примеры типов](#примеры-типов)

---

## Примеры layout файлов

### app/manage/[workspaceId]/layout.tsx

```typescript
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MainLayout } from '@/components/layout/MainLayout'

export default function ManageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspaceId: string }
}) {
  return (
    <MainLayout>
      <Sidebar workspaceId={params.workspaceId} />
      <div className="flex-1 flex flex-col">
        <Header workspaceId={params.workspaceId} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </MainLayout>
  )
}
```

---

## Примеры page файлов

### app/manage/[workspaceId]/ai-agents/page.tsx

```typescript
import { AgentList } from '@/components/features/agents/AgentList'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AgentsPage({
  params,
}: {
  params: { workspaceId: string }
}) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Агенты ИИ', href: `/manage/${params.workspaceId}/ai-agents` },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Агенты ИИ</h1>
        <Link href={`/manage/${params.workspaceId}/ai-agents/create`}>
          <Button>Создать</Button>
        </Link>
      </div>
      <AgentList workspaceId={params.workspaceId} />
    </>
  )
}
```

### app/manage/[workspaceId]/ai-agents/[id]/edit/page.tsx

```typescript
import { AgentTabs } from '@/components/features/agents/AgentTabs'
import { BasicSettings } from '@/components/features/agents/BasicSettings'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { notFound } from 'next/navigation'

export default async function EditAgentPage({
  params,
}: {
  params: { workspaceId: string; id: string }
}) {
  // Загрузка данных агента
  const agent = await getAgent(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Агенты ИИ', href: `/manage/${params.workspaceId}/ai-agents` },
          { label: agent.name, href: `/manage/${params.workspaceId}/ai-agents/${params.id}/edit` },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Редактирование {agent.name}</h1>
        <Button variant="destructive">Удалить</Button>
      </div>
      <AgentTabs agentId={params.id} workspaceId={params.workspaceId} />
    </>
  )
}
```

---

## Примеры API routes

### app/api/v1/agents/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { agentRepository } from '@/lib/repositories/agent.repository'
import { z } from 'zod'

const createAgentSchema = z.object({
  name: z.string().min(1).max(255),
})

// GET /api/v1/agents
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const agents = await agentRepository.findMany({
      workspaceId: session.user.workspaceId,
      page,
      limit,
      search,
    })

    return NextResponse.json({ data: agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/v1/agents
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createAgentSchema.parse(body)

    const agent = await agentRepository.create({
      ...validated,
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
    })

    return NextResponse.json({ data: agent }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', fields: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### app/api/v1/agents/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { agentRepository } from '@/lib/repositories/agent.repository'

// GET /api/v1/agents/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agent = await agentRepository.findById(params.id)

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Проверка доступа
    if (agent.workspaceId !== session.user.workspaceId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ data: agent })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/agents/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const agent = await agentRepository.update(params.id, body)

    return NextResponse.json({ data: agent })
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/agents/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await agentRepository.delete(params.id)

    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Примеры компонентов

### components/features/agents/AgentList.tsx

```typescript
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Searchbox } from '@/components/ui/searchbox'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface AgentListProps {
  workspaceId: string
}

export function AgentList({ workspaceId }: AgentListProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['agents', workspaceId, search, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/agents?search=${search}&page=${page}`
      )
      if (!response.ok) throw new Error('Failed to fetch agents')
      return response.json()
    },
  })

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <div className="space-y-4">
      <Searchbox
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Активно</th>
            <th>Модель ИИ</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((agent: any) => (
            <tr key={agent.id}>
              <td>
                <Link
                  href={`/manage/${workspaceId}/ai-agents/${agent.id}/edit`}
                >
                  {agent.name}
                </Link>
              </td>
              <td>{agent.isActive ? 'Да' : 'Нет'}</td>
              <td>{agent.model}</td>
              <td>
                <Button variant="ghost" size="sm">
                  Изменить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
```

### components/layout/Sidebar.tsx

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  FolderTree,
  FileText,
  Settings,
  CreditCard,
} from 'lucide-react'

interface SidebarProps {
  workspaceId: string
}

const navItems = [
  {
    label: 'Инфопанель',
    href: `/manage/[workspaceId]`,
    icon: LayoutDashboard,
  },
  {
    label: 'Агенты ИИ',
    href: `/manage/[workspaceId]/ai-agents`,
    icon: Bot,
    children: [
      {
        label: 'Агенты ИИ',
        href: `/manage/[workspaceId]/ai-agents`,
      },
      {
        label: 'Тестовый чат',
        href: `/manage/[workspaceId]/test-chat`,
      },
    ],
  },
  {
    label: 'База знаний',
    icon: FolderTree,
    children: [
      {
        label: 'Категории',
        href: `/manage/[workspaceId]/knowledge-categories`,
      },
      {
        label: 'Статьи',
        href: `/manage/[workspaceId]/knowledge-items`,
      },
    ],
  },
  {
    label: 'Аккаунт',
    icon: Settings,
    children: [
      {
        label: 'Настройки аккаунта',
        href: `/manage/[workspaceId]/account-settings`,
      },
      {
        label: 'Тарифные планы',
        href: `/manage/[workspaceId]/pricing`,
      },
    ],
  },
]

export function Sidebar({ workspaceId }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4">
        <Link href={`/manage/${workspaceId}`}>
          <h2 className="text-xl font-bold">GPT Агент</h2>
        </Link>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <NavGroup item={item} workspaceId={workspaceId} />
              ) : (
                <NavLink
                  href={item.href.replace('[workspaceId]', workspaceId)}
                  label={item.label}
                  icon={item.icon}
                  isActive={pathname === item.href.replace('[workspaceId]', workspaceId)}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
```

---

## Примеры сервисов

### lib/services/agent.service.ts

```typescript
import { agentRepository } from '@/lib/repositories/agent.repository'
import { aiService } from '@/lib/services/ai/openai.client'
import { crmService } from '@/lib/services/crm.service'

export class AgentService {
  async create(data: CreateAgentInput) {
    const agent = await agentRepository.create(data)
    
    // Инициализация агента в AI системе
    await aiService.initializeAgent(agent.id)
    
    return agent
  }

  async update(id: string, data: UpdateAgentInput) {
    const agent = await agentRepository.update(id, data)
    
    // Обновление конфигурации в AI системе
    await aiService.updateAgentConfig(id, data)
    
    return agent
  }

  async syncCRM(id: string, type: 'funnels' | 'channels' | 'fields') {
    const agent = await agentRepository.findById(id)
    if (!agent) throw new Error('Agent not found')

    const crmData = await crmService.sync(agent.workspaceId, type)
    
    // Обновление конфигурации агента
    await agentRepository.update(id, {
      crmConfig: crmData,
    })

    return crmData
  }

  async copy(id: string, name?: string) {
    const original = await agentRepository.findById(id)
    if (!original) throw new Error('Agent not found')

    const copied = await agentRepository.create({
      ...original,
      name: name || `${original.name} (копия)`,
      id: undefined, // Новый ID будет сгенерирован
    })

    return copied
  }
}

export const agentService = new AgentService()
```

### lib/services/ai/openai.client.ts

```typescript
import OpenAI from 'openai'

export class OpenAIService {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async initializeAgent(agentId: string) {
    // Инициализация агента в GPT-5
    // Custom instructions, tool calling setup, и т.д.
  }

  async updateAgentConfig(agentId: string, config: any) {
    // Обновление конфигурации агента
  }

  async processMessage(agentId: string, message: string) {
    // Обработка сообщения через GPT-5
    const response = await this.client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are an AI agent with ID: ${agentId}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    return response.choices[0].message.content
  }
}

export const aiService = new OpenAIService()
```

---

## Примеры типов

### types/agent.ts

```typescript
export interface Agent {
  id: string
  name: string
  isActive: boolean
  instructions: string
  checkBeforeSending: boolean
  
  // Настройки воронок
  funnelConfigs: FunnelConfig[]
  
  // Настройки каналов
  channelConfigs: ChannelConfig
  
  // Настройки базы знаний
  knowledgeBaseConfig: KnowledgeBaseConfig
  
  // Настройки доступа к данным
  dataAccessConfig: DataAccessConfig
  
  // Настройки ввода данных
  dataInputConfig: DataInputConfig
  
  // Расширенные настройки
  advancedSettings: AdvancedSettings
  
  // Метаданные
  workspaceId: string
  userId: string
  modelId: number
  createdAt: Date
  updatedAt: Date
}

export interface FunnelConfig {
  funnelId: number
  funnelName: string
  isActive: boolean
  stages: StageConfig[]
}

export interface StageConfig {
  stageId: number
  stageName: string
  isActive: boolean
}

export interface ChannelConfig {
  allChannels: boolean
  selectedChannels: number[]
}

export interface KnowledgeBaseConfig {
  allCategories: boolean
  selectedCategories: string[]
  createTaskIfNotFound: boolean
  messageIfNotFound: string
}

export interface DataAccessConfig {
  dealFields: number[]
  contactFields: number[]
}

export interface DataInputConfig {
  dealRules: FieldUpdateRule[]
  contactRules: FieldUpdateRule[]
}

export interface FieldUpdateRule {
  id?: number
  fieldId: number
  fieldName: string
  overwriteExisting: boolean
  condition: string
  order: number
}

export interface AdvancedSettings {
  modelId: number
  autoDetectLanguage: boolean
  creativity: 'precise' | 'balanced' | 'creative'
  responseDelay: number
}

export type CreateAgentInput = Pick<Agent, 'name'>
export type UpdateAgentInput = Partial<Omit<Agent, 'id' | 'workspaceId' | 'userId' | 'createdAt' | 'updatedAt'>>
```

---

## 📝 Примечания

Все примеры кода основаны на:
- ✅ Next.js 14 App Router
- ✅ TypeScript
- ✅ React Server Components
- ✅ React Query для клиентских данных
- ✅ Zod для валидации
- ✅ shadcn/ui компоненты

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

