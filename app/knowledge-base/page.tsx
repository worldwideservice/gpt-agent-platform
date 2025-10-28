'use client'

import { useState } from 'react'
import { Plus, Search, FolderOpen, FileText } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import type { KnowledgeBaseCategory, KnowledgeBaseArticle } from '@/types'

const mockCategories: KnowledgeBaseCategory[] = [
  { id: '1', name: 'Продукты и услуги', articlesCount: 15, createdAt: new Date('2024-01-10') },
  { id: '2', name: 'Часто задаваемые вопросы', articlesCount: 28, createdAt: new Date('2024-01-15') },
  { id: '3', name: 'Цены и тарифы', articlesCount: 8, createdAt: new Date('2024-02-01') },
  { id: '4', name: 'Политика компании', articlesCount: 5, createdAt: new Date('2024-01-20') },
]

const mockArticles: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'Как оформить заказ?',
    categoryId: '2',
    content: 'Инструкция по оформлению заказа...',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: '2',
    title: 'Условия доставки',
    categoryId: '1',
    content: 'Информация о доставке...',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-10-18'),
  },
  {
    id: '3',
    title: 'Тарифный план "Базовый"',
    categoryId: '3',
    content: 'Описание тарифа...',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-10-15'),
  },
]

const KnowledgeBasePage = () => {
  const [categories] = useState<KnowledgeBaseCategory[]>(mockCategories)
  const [articles] = useState<KnowledgeBaseArticle[]>(mockArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'category' | 'article'>('article')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateCategory = () => {
    setModalType('category')
    setCreateModalOpen(true)
  }

  const handleCreateArticle = () => {
    setModalType('article')
    setCreateModalOpen(true)
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || article.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">База знаний</h1>
          <p className="text-gray-600 mt-1">
            Управление статьями и категориями для обучения AI-агентов
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleCreateCategory}>
            <Plus className="w-5 h-5 mr-2" />
            Категория
          </Button>
          <Button onClick={handleCreateArticle}>
            <Plus className="w-5 h-5 mr-2" />
            Статья
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Поиск по статьям..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-4">Категории</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Все статьи
                  </span>
                  <Badge variant="default">{articles.length}</Badge>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {category.name}
                    </span>
                    <Badge variant="default">{category.articlesCount}</Badge>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'Статьи не найдены' : 'Нет статей в этой категории'}
                  </p>
                  <Button onClick={handleCreateArticle}>
                    Создать статью
                  </Button>
                </CardBody>
              </Card>
            ) : (
              filteredArticles.map((article) => {
                const category = categories.find(c => c.id === article.categoryId)
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">{article.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {article.content}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {category && (
                              <span className="flex items-center">
                                <FolderOpen className="w-3 h-3 mr-1" />
                                {category.name}
                              </span>
                            )}
                            <span>
                              Обновлено: {article.updatedAt.toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Редактировать
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={modalType === 'category' ? 'Создание категории' : 'Создание статьи'}
        size="lg"
      >
        <div className="space-y-4">
          {modalType === 'category' ? (
            <>
              <Input
                label="Название категории"
                placeholder="Например: Часто задаваемые вопросы"
              />
              <Textarea
                label="Описание"
                placeholder="Краткое описание категории"
                rows={3}
              />
            </>
          ) : (
            <>
              <Input
                label="Заголовок статьи"
                placeholder="Например: Как оформить заказ?"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white">
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                label="Содержание"
                placeholder="Текст статьи..."
                rows={8}
              />
            </>
          )}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setCreateModalOpen(false)}>
              Создать
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default KnowledgeBasePage

