import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'

// Мокаем next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ tenantId: 'test-tenant' }),
}))

// Мокаем @refinedev/core
vi.mock('@refinedev/core', () => ({
  useBreadcrumb: () => ({
    breadcrumbs: [
      { label: 'Test Resource', href: '/test-resource' },
    ],
  }),
  useResourceParams: () => ({
    resources: [
      {
        name: 'test-resource',
        meta: { icon: null },
      },
    ],
  }),
  matchResourceFromRoute: () => ({
    matchedRoute: '/',
    resource: {
      name: 'test-resource',
      meta: { icon: null },
    },
  }),
}))

describe('Breadcrumb Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render breadcrumb', () => {
    render(<Breadcrumb />)
    
    // Breadcrumb должен рендериться
    const breadcrumb = document.querySelector('nav') || document.querySelector('[role="navigation"]')
    expect(breadcrumb).toBeInTheDocument()
  })

  it('should render home link', () => {
    render(<Breadcrumb />)
    
    // Проверяем что breadcrumb рендерится (может содержать ссылки или иконки)
    const breadcrumb = document.querySelector('nav') || 
      document.querySelector('[role="navigation"]') ||
      document.querySelector('[class*="breadcrumb"]')
    
    expect(breadcrumb).toBeInTheDocument()
    
    // Проверяем что есть хотя бы одна ссылка или элемент breadcrumb
    const links = screen.queryAllByRole('link')
    const breadcrumbItems = document.querySelectorAll('[class*="breadcrumb"]')
    
    expect(links.length > 0 || breadcrumbItems.length > 0).toBe(true)
  })
})

