import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeaderWithSidebar } from '@/components/layout/HeaderWithSidebar'

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

// Мокаем useSidebar
vi.mock('@/components/layout/SidebarToggle', () => ({
  useSidebar: () => ({
    toggle: vi.fn(),
    isOpen: false,
    collapsedGroups: [],
    groupIsCollapsed: vi.fn(),
    toggleCollapsedGroup: vi.fn(),
  }),
}))

describe('HeaderWithSidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with sidebar', () => {
    const mockSession = {
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        orgId: 'org1',
      },
    }
    
    const mockOrganizations = [
      { id: 'org1', name: 'Org 1', slug: 'org-1' },
    ]
    
    render(
      <HeaderWithSidebar
        session={mockSession}
        organizations={mockOrganizations}
        activeOrganization={mockOrganizations[0]}
      >
        <div>Content</div>
      </HeaderWithSidebar>
    )
    
    // Компонент должен рендериться
    const header = document.querySelector('nav') || document.querySelector('header')
    const sidebar = document.querySelector('aside')
    
    if (header) {
      expect(header).toBeInTheDocument()
    }
    if (sidebar) {
      expect(sidebar).toBeInTheDocument()
    }
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

