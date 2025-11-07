import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view'

// Mock Next.js
vi.mock('next/navigation', () => ({
  useParams: () => ({}),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock Refine hooks
vi.mock('@refinedev/core', () => ({
  useBack: () => vi.fn(),
  useResourceParams: () => ({
    resource: { name: 'agents', meta: { label: 'Агенты' } },
    identifier: 'agents',
    resources: [],
  }),
  useUserFriendlyName: () => (name: string) => name,
  useBreadcrumb: () => ({
    breadcrumbs: [],
  }),
  matchResourceFromRoute: () => ({
    matchedRoute: '/',
    resource: { name: 'agents', meta: { label: 'Агенты' } },
  }),
}))

describe('CreateView Component', () => {
  it('should render children', () => {
    render(
      <CreateView>
        <div>Test content</div>
      </CreateView>,
    )

    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <CreateView className="custom-class">
        <div>Content</div>
      </CreateView>,
    )

    const view = container.firstChild as HTMLElement
    expect(view).toHaveClass('custom-class')
  })

  it('should render CreateViewHeader with title', () => {
    render(<CreateViewHeader title="Create Agent" />)

    expect(screen.getByText(/create agent/i)).toBeInTheDocument()
  })

  it('should render back button in header', () => {
    render(<CreateViewHeader />)

    const backButton = screen.getByRole('button')
    expect(backButton).toBeInTheDocument()
  })
})

