import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarToggle'

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

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar', () => {
    const mockOrganizations = [
      { id: 'org1', name: 'Org 1', slug: 'org-1' },
    ]
    
    render(
      <SidebarProvider>
        <Sidebar organizations={mockOrganizations} />
      </SidebarProvider>
    )
    
    // Sidebar должен рендериться
    const sidebar = document.querySelector('aside')
    expect(sidebar).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    const mockOrganizations = [
      { id: 'org1', name: 'Org 1', slug: 'org-1' },
    ]
    
    render(
      <SidebarProvider>
        <Sidebar organizations={mockOrganizations} />
      </SidebarProvider>
    )
    
    // Проверяем что навигационные элементы отображаются
    const navItems = screen.queryAllByRole('link')
    expect(navItems.length).toBeGreaterThan(0)
  })
})

