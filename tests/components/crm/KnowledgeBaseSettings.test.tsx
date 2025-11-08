import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KnowledgeBaseSettings } from '@/components/crm/KnowledgeBaseSettings'

describe('KnowledgeBaseSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render knowledge base settings', () => {
    const onAllCategoriesToggle = vi.fn()
    const onCreateTaskToggle = vi.fn()
    const onMessageChange = vi.fn()
    const onOpenKnowledgeBase = vi.fn()
    
    render(
      <KnowledgeBaseSettings
        allCategoriesEnabled={false}
        createTaskOnNotFound={false}
        notFoundMessage=""
        onAllCategoriesToggle={onAllCategoriesToggle}
        onCreateTaskToggle={onCreateTaskToggle}
        onMessageChange={onMessageChange}
        onOpenKnowledgeBase={onOpenKnowledgeBase}
      />
    )
    
    // Компонент должен рендериться
    expect(screen.getByText(/база знаний/i)).toBeInTheDocument()
  })

  it('should render enable switches', () => {
    const onAllCategoriesToggle = vi.fn()
    const onCreateTaskToggle = vi.fn()
    const onMessageChange = vi.fn()
    const onOpenKnowledgeBase = vi.fn()
    
    render(
      <KnowledgeBaseSettings
        allCategoriesEnabled={false}
        createTaskOnNotFound={false}
        notFoundMessage=""
        onAllCategoriesToggle={onAllCategoriesToggle}
        onCreateTaskToggle={onCreateTaskToggle}
        onMessageChange={onMessageChange}
        onOpenKnowledgeBase={onOpenKnowledgeBase}
      />
    )
    
    // Проверяем что есть переключатели
    const switches = screen.queryAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
  })
})

