import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountSettings } from '@/components/settings/AccountSettings'

describe('AccountSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render account settings page', () => {
    render(<AccountSettings />)
    
    const title = screen.getByRole('heading', { level: 1, name: /настройки аккаунта/i })
    expect(title).toBeInTheDocument()
  })

  it('should render general settings section', () => {
    render(<AccountSettings />)
    
    const sectionTitle = screen.getByRole('heading', { level: 2, name: /общие/i })
    expect(sectionTitle).toBeInTheDocument()
  })

  it('should render stop agents switch', () => {
    render(<AccountSettings />)
    
    const switchElement = screen.getByRole('switch', { name: /останавливать агентов/i })
    expect(switchElement).toBeInTheDocument()
  })

  it('should render switch label and description', () => {
    render(<AccountSettings />)
    
    const label = screen.getByText(/останавливать агентов ИИ при ответе человека/i)
    expect(label).toBeInTheDocument()
    
    const description = screen.getByText(/если включено, агенты ИИ перестанут отвечать/i)
    expect(description).toBeInTheDocument()
  })

  it('should toggle switch on click', async () => {
    const user = userEvent.setup()
    render(<AccountSettings />)
    
    const switchElement = screen.getByRole('switch', { name: /останавливать агентов/i })
    const initialChecked = switchElement.getAttribute('aria-checked') === 'true'
    
    await user.click(switchElement)
    
    // Ждем обновления состояния
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newChecked = switchElement.getAttribute('aria-checked') === 'true'
    expect(newChecked).not.toBe(initialChecked)
  })

  it('should render save button', () => {
    render(<AccountSettings />)
    
    const saveButton = screen.getByRole('button', { name: /сохранить изменения/i })
    expect(saveButton).toBeInTheDocument()
  })

  it('should have switch initially unchecked', () => {
    render(<AccountSettings />)
    
    const switchElement = screen.getByRole('switch', { name: /останавливать агентов/i })
    expect(switchElement.getAttribute('aria-checked')).toBe('false')
  })
})

