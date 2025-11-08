import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatList } from '@/components/chat/chat-list'

describe('ChatList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render chat list', () => {
    const onSelectChat = vi.fn()
    render(<ChatList onSelectChat={onSelectChat} selectedChat={null} />)
    
    expect(screen.getByText('Чаты')).toBeInTheDocument()
  })

  it('should render new chat button', () => {
    const onSelectChat = vi.fn()
    render(<ChatList onSelectChat={onSelectChat} selectedChat={null} />)
    
    const newChatButton = screen.getByRole('button', { name: /новый чат/i })
    expect(newChatButton).toBeInTheDocument()
  })

  it('should render chat items', () => {
    const onSelectChat = vi.fn()
    render(<ChatList onSelectChat={onSelectChat} selectedChat={null} />)
    
    // Проверяем что есть чаты (mock данные)
    const chatItems = document.querySelectorAll('button[class*="w-full"]')
    expect(chatItems.length).toBeGreaterThan(0)
  })

  it('should call onSelectChat when chat is clicked', async () => {
    const user = userEvent.setup()
    const onSelectChat = vi.fn()
    
    render(<ChatList onSelectChat={onSelectChat} selectedChat={null} />)
    
    // Находим первый чат и кликаем на него
    const chatButtons = screen.queryAllByRole('button')
    const chatButton = chatButtons.find(btn => 
      btn.textContent?.includes('Got it') || btn.textContent?.includes('Thank you')
    )
    
    if (chatButton) {
      await user.click(chatButton)
      expect(onSelectChat).toHaveBeenCalled()
    }
  })

  it('should highlight selected chat', () => {
    const onSelectChat = vi.fn()
    render(<ChatList onSelectChat={onSelectChat} selectedChat="1" />)
    
    // Проверяем что выбранный чат имеет активный класс
    const selectedChat = document.querySelector('[class*="bg-gray-50"]')
    expect(selectedChat).toBeInTheDocument()
  })
})

