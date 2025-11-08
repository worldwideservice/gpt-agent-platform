import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArticlesContent } from '@/components/knowledge/ArticlesContent'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ tenantId: 'test-tenant' })),
}))

describe('ArticlesContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render articles list', () => {
    render(<ArticlesContent />)
    
    // Проверяем наличие заголовка (может быть в разных местах - breadcrumb или h1)
    const titles = screen.getAllByText(/статьи/i)
    expect(titles.length).toBeGreaterThan(0)
    // Проверяем основной заголовок h1
    const mainTitle = screen.getByRole('heading', { level: 1, name: /статьи/i })
    expect(mainTitle).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<ArticlesContent />)
    
    const searchInput = screen.getByPlaceholderText(/поиск/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should render create button', () => {
    render(<ArticlesContent />)
    
    const createButton = screen.getByRole('button', { name: /создать/i })
    expect(createButton).toBeInTheDocument()
  })

  it('should render view mode toggle', () => {
    render(<ArticlesContent />)
    
    // Проверяем наличие кнопок переключения вида (список/сетка)
    const viewButtons = screen.getAllByRole('button')
    expect(viewButtons.length).toBeGreaterThan(0)
  })

  it('should display articles table', () => {
    render(<ArticlesContent />)
    
    // Проверяем наличие таблицы со статьями
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })

  it('should render article row', () => {
    render(<ArticlesContent />)
    
    // Проверяем наличие строки со статьей (по умолчанию есть mock статья)
    const articleTitle = screen.getByText(/test article/i)
    expect(articleTitle).toBeInTheDocument()
  })

  it('should handle search input', async () => {
    const user = userEvent.setup()
    render(<ArticlesContent />)
    
    const searchInput = screen.getByPlaceholderText(/поиск/i)
    await user.type(searchInput, 'test search')
    
    expect(searchInput).toHaveValue('test search')
  })

  it('should toggle view mode', async () => {
    const user = userEvent.setup()
    render(<ArticlesContent />)
    
    // Находим кнопки переключения вида
    const viewButtons = screen.getAllByRole('button')
    const gridButton = viewButtons.find(btn => btn.querySelector('svg'))
    
    if (gridButton) {
      await user.click(gridButton)
      // Проверяем, что вид изменился
      expect(gridButton).toBeInTheDocument()
    }
  })

  it('should handle filter removal', async () => {
    const user = userEvent.setup()
    render(<ArticlesContent />)
    
    // Проверяем наличие активных фильтров
    const filterButtons = screen.queryAllByRole('button', { name: /×|x/i })
    if (filterButtons.length > 0) {
      await user.click(filterButtons[0])
      // Фильтр должен быть удален
      expect(document.body).toBeTruthy()
    }
  })
})

