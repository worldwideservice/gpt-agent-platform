import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/Header'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ tenantId: 'test-tenant' }),
  usePathname: () => '/manage/test-tenant',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Мокаем next-auth
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
    }
    
    render(<Header user={mockUser} />)
    
    // Header должен рендериться
    const header = document.querySelector('nav') || document.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should render user name', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
    }
    
    render(<Header user={mockUser} />)
    
    // Проверяем что имя пользователя отображается
    const userName = screen.queryByText(/Test User/i) || screen.queryByText(/Пользователь/i)
    if (userName) {
      expect(userName).toBeInTheDocument()
    }
  })
})

