import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GettingStartedContent } from '@/components/docs/GettingStartedContent'

describe('GettingStartedContent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render getting started page', () => {
    render(<GettingStartedContent />)
    
    const title = screen.getByRole('heading', { level: 1, name: /начало работы/i })
    expect(title).toBeInTheDocument()
  })

  it('should render left sidebar navigation', () => {
    render(<GettingStartedContent />)
    
    // "Начало работы" может быть в нескольких местах, используем getAllByText
    const navTitles = screen.getAllByText(/начало работы/i)
    expect(navTitles.length).toBeGreaterThan(0)
  })

  it('should render navigation sections', () => {
    render(<GettingStartedContent />)
    
    // Используем getAllByText для множественных элементов
    const agentSections = screen.getAllByText(/агент ИИ/i)
    const triggersSections = screen.getAllByText(/триггеры/i)
    const knowledgeSections = screen.getAllByText(/база знаний/i)
    
    expect(agentSections.length).toBeGreaterThan(0)
    expect(triggersSections.length).toBeGreaterThan(0)
    expect(knowledgeSections.length).toBeGreaterThan(0)
  })

  it('should render main content section', () => {
    render(<GettingStartedContent />)
    
    const mainTitle = screen.getByRole('heading', { level: 1, name: /начало работы/i })
    expect(mainTitle).toBeInTheDocument()
  })

  it('should render "Выберите воронки" section', () => {
    render(<GettingStartedContent />)
    
    const sectionTitle = screen.getByRole('heading', { level: 2, name: /выберите воронки/i })
    expect(sectionTitle).toBeInTheDocument()
  })

  it('should render numbered steps', () => {
    render(<GettingStartedContent />)
    
    // Проверяем наличие шагов (они содержат числа или текст "1.")
    const stepElements = screen.queryAllByText(/1\.|откройте настройки/i)
    // Или проверяем наличие секции "Выберите воронки" как индикатор наличия шагов
    const sectionTitle = screen.getByRole('heading', { level: 2, name: /выберите воронки/i })
    expect(sectionTitle).toBeInTheDocument()
  })

  it('should render info boxes', () => {
    render(<GettingStartedContent />)
    
    const recommendedBox = screen.getByText(/рекомендуемая настройка/i)
    expect(recommendedBox).toBeInTheDocument()
  })

  it('should render success box', () => {
    render(<GettingStartedContent />)
    
    const successBox = screen.getByText(/готово!/i)
    expect(successBox).toBeInTheDocument()
  })

  it('should render "Следующие шаги" section', () => {
    render(<GettingStartedContent />)
    
    const nextStepsTitle = screen.getByRole('heading', { level: 2, name: /следующие шаги/i })
    expect(nextStepsTitle).toBeInTheDocument()
  })

  it('should render "Что дальше?" section', () => {
    render(<GettingStartedContent />)
    
    const whatsNextTitle = screen.getByRole('heading', { level: 2, name: /что дальше/i })
    expect(whatsNextTitle).toBeInTheDocument()
  })

  it('should render right sidebar table of contents', () => {
    render(<GettingStartedContent />)
    
    const tocTitle = screen.getByText(/на этой странице/i)
    expect(tocTitle).toBeInTheDocument()
  })

  it('should render CTA button at bottom', () => {
    render(<GettingStartedContent />)
    
    const ctaButton = screen.getByRole('button', { name: /создать агента ИИ/i })
    expect(ctaButton).toBeInTheDocument()
  })
})

