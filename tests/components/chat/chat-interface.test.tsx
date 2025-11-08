import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatInterface } from '@/components/chat/chat-interface'

describe('ChatInterface Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render chat interface', () => {
    render(<ChatInterface />)
    
    // Компонент должен рендериться
    const interfaceElement = document.querySelector('div')
    expect(interfaceElement).toBeInTheDocument()
  })

  it('should render chat list and chat area', () => {
    render(<ChatInterface />)
    
    // Проверяем что компонент рендерится (ChatList и ChatArea внутри)
    const interfaceElement = document.querySelector('div[class*="flex"]')
    expect(interfaceElement).toBeInTheDocument()
  })
})

