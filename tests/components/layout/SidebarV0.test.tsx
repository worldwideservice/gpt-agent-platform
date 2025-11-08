import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarV0 } from '@/components/layout/SidebarV0'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ tenantId: 'test-tenant' })),
  usePathname: vi.fn(() => '/manage/test-tenant'),
}))

describe('SidebarV0 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar with organization name', () => {
    render(<SidebarV0 />)
    const orgName = screen.getByText('World Wide Services')
    expect(orgName).toBeInTheDocument()
  })

  it('should render dashboard link', () => {
    render(<SidebarV0 activePage="dashboard" />)
    const dashboardLink = screen.getByText('Инфопанель')
    expect(dashboardLink).toBeInTheDocument()
  })

  it('should render AI agents section', () => {
    render(<SidebarV0 />)
    // Ищем секцию "Агенты ИИ" - это может быть заголовок секции или ссылка
    // В SidebarV0 "Агенты ИИ" может быть и заголовком секции, и ссылкой внутри
    const agentsElements = screen.getAllByText('Агенты ИИ')
    expect(agentsElements.length).toBeGreaterThan(0)
    // Проверяем, что хотя бы один элемент найден
    expect(agentsElements[0]).toBeInTheDocument()
  })

  it('should render knowledge base section', () => {
    render(<SidebarV0 />)
    const knowledgeSection = screen.getByText('База знаний')
    expect(knowledgeSection).toBeInTheDocument()
  })

  it('should render support section', () => {
    render(<SidebarV0 />)
    const supportSection = screen.getByText('Поддержка')
    expect(supportSection).toBeInTheDocument()
  })

  it('should render account section', () => {
    render(<SidebarV0 />)
    const accountSection = screen.getByText('Аккаунт')
    expect(accountSection).toBeInTheDocument()
  })

  it('should highlight active page', () => {
    render(<SidebarV0 activePage="dashboard" />)
    const dashboardLink = screen.getByText('Инфопанель')
    expect(dashboardLink.closest('a')).toHaveClass('bg-blue-50', 'text-blue-600')
  })

  it('should render all navigation items', () => {
    render(<SidebarV0 />)
    
    // Проверяем основные элементы навигации
    expect(screen.getByText('Инфопанель')).toBeInTheDocument()
    // "Агенты ИИ" может быть как заголовок секции, так и ссылка
    const agentsElements = screen.getAllByText('Агенты ИИ')
    expect(agentsElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Тестовый чат')).toBeInTheDocument()
    expect(screen.getByText('Категории')).toBeInTheDocument()
    expect(screen.getByText('Статьи')).toBeInTheDocument()
    expect(screen.getByText('Начало работы')).toBeInTheDocument()
    expect(screen.getByText('Настройки аккаунта')).toBeInTheDocument()
    expect(screen.getByText('Тарифные планы')).toBeInTheDocument()
  })
})

