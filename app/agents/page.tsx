'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

import { AgentTable } from '@/components/agents/AgentTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { Agent } from '@/types'

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Консультант по продажам',
    status: 'active',
    model: 'GPT-4',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: '2',
    name: 'Техническая поддержка',
    status: 'active',
    model: 'GPT-4',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-10-25'),
  },
  {
    id: '3',
    name: 'Квалификация лидов',
    status: 'active',
    model: 'GPT-4 Turbo',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-10-22'),
  },
  {
    id: '4',
    name: 'FAQ-бот',
    status: 'inactive',
    model: 'GPT-3.5 Turbo',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-09-15'),
  },
  {
    id: '5',
    name: 'Новый агент',
    status: 'draft',
    model: 'GPT-4',
    createdAt: new Date('2024-10-28'),
    updatedAt: new Date('2024-10-28'),
  },
]

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null)

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setAgentToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (agentToDelete) {
      setAgents(prev => prev.filter(agent => agent.id !== agentToDelete))
      setDeleteModalOpen(false)
      setAgentToDelete(null)
    }
  }

  const handleDuplicate = (id: string) => {
    const agentToDuplicate = agents.find(agent => agent.id === id)
    if (agentToDuplicate) {
      const newAgent: Agent = {
        ...agentToDuplicate,
        id: Date.now().toString(),
        name: `${agentToDuplicate.name} (копия)`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setAgents(prev => [...prev, newAgent])
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Агенты ИИ</h1>
          <p className="text-gray-600 mt-1">
            Управление AI-агентами для автоматизации общения
          </p>
        </div>
        <Link href="/agents/new">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Создать агента
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Поиск по агентам..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <AgentTable
        agents={filteredAgents}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Подтверждение удаления"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.
          </p>
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AgentsPage

