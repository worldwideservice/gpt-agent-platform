import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SupportContent } from '@/components/support/SupportContent'

// Мокаем next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('SupportContent Component', () => {
  it('should render internal variant by default', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/центр поддержки/i)).toBeInTheDocument()
  })

  it('should render public variant', () => {
    render(<SupportContent variant="public" />)
    
    expect(screen.getByText(/поддержка и обучение/i)).toBeInTheDocument()
  })

  it('should render internal variant', () => {
    render(<SupportContent variant="internal" />)
    
    expect(screen.getByText(/центр поддержки/i)).toBeInTheDocument()
  })

  it('should show registration buttons in public variant', () => {
    render(<SupportContent variant="public" />)
    
    expect(screen.getByRole('link', { name: /создать аккаунт/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /войти/i })).toBeInTheDocument()
  })

  it('should not show registration buttons in internal variant', () => {
    render(<SupportContent variant="internal" />)
    
    expect(screen.queryByRole('link', { name: /создать аккаунт/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /войти/i })).not.toBeInTheDocument()
  })

  it('should render all support sections', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/начало работы/i)).toBeInTheDocument()
    expect(screen.getByText(/видеоуроки/i)).toBeInTheDocument()
    expect(screen.getByText(/документация/i)).toBeInTheDocument()
    expect(screen.getByText(/faq и биллинг/i)).toBeInTheDocument()
  })

  it('should render getting started links', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/создание аккаунта и настройка рабочей организации/i)).toBeInTheDocument()
    expect(screen.getByText(/первый ai-агент: инструкции, каналы и приветствие/i)).toBeInTheDocument()
    expect(screen.getByText(/подключение kommo crm и синхронизация воронок/i)).toBeInTheDocument()
  })

  it('should render video library links', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/обзор интерфейса gpt agent/i)).toBeInTheDocument()
    expect(screen.getByText(/работа с базой знаний и обучением агента/i)).toBeInTheDocument()
    expect(screen.getByText(/автоматизация и триггеры в crm/i)).toBeInTheDocument()
  })

  it('should render documentation links', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/структура базы знаний и faq по наполнению/i)).toBeInTheDocument()
    expect(screen.getByText(/api и вебхуки: подключение новых каналов/i)).toBeInTheDocument()
    expect(screen.getByText(/контроль качества ответов и модерация/i)).toBeInTheDocument()
  })

  it('should render FAQ links', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/тарифы, оплата и гранты для старта/i)).toBeInTheDocument()
    expect(screen.getByText(/лимиты и квоты ответов ИИ/i)).toBeInTheDocument()
    expect(screen.getByText(/управление пользователями и ролями/i)).toBeInTheDocument()
  })

  it('should render help section', () => {
    render(<SupportContent />)
    
    expect(screen.getByText(/нужна помощь/i)).toBeInTheDocument()
    expect(screen.getByText(/email поддержки/i)).toBeInTheDocument()
    expect(screen.getByText(/технический чат/i)).toBeInTheDocument()
    expect(screen.getByText(/стратегическая сессия/i)).toBeInTheDocument()
  })

  it('should render support email link', () => {
    render(<SupportContent />)
    
    const emailLink = screen.getByRole('link', { name: /support@gptagent.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:support@gptagent.com')
  })

  it('should render telegram support link', () => {
    render(<SupportContent />)
    
    const telegramLink = screen.getByRole('link', { name: /telegram @gptagent_support_bot/i })
    expect(telegramLink).toBeInTheDocument()
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/gptagent_support_bot')
    // target="_blank" может быть не установлен из-за мока next/link
    // Проверяем только href
  })

  it('should render cal.com booking link', () => {
    render(<SupportContent />)
    
    const bookingLink = screen.getByRole('link', { name: /забронировать встречу с менеджером/i })
    expect(bookingLink).toBeInTheDocument()
    expect(bookingLink).toHaveAttribute('href', 'https://cal.com/gpt-agent/implementation')
    // target="_blank" может быть не установлен из-за мока next/link
    // Проверяем только href
  })
})

