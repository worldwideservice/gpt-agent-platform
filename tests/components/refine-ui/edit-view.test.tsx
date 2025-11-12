import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view'

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
    id: 'agent-123',
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

// Mock RefreshButton
vi.mock('@/components/refine-ui/buttons/refresh', () => ({
  RefreshButton: ({ recordItemId }: { recordItemId?: string }) => (
    <button>Refresh {recordItemId}</button>
  ),
}))

describe('EditView Component', () => {
  it('should render children', () => {
    render(
      <EditView>
        <div>Test content</div>
      </EditView>,
    )

    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <EditView className="custom-class">
        <div>Content</div>
      </EditView>,
    )

    const view = container.firstChild as HTMLElement
    expect(view).toHaveClass('custom-class')
  })

  it('should render EditViewHeader with title', () => {
    render(<EditViewHeader title="Edit Agent" />)

    expect(screen.getByText(/edit agent/i)).toBeInTheDocument()
  })

  it('should render back button and refresh button in header', () => {
    render(<EditViewHeader />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByText(/refresh/i)).toBeInTheDocument()
  })

  it('should render actions slot in header', () => {
    render(
      <EditViewHeader actionsSlot={<button>Custom Action</button>} />,
    )

    expect(screen.getByText(/custom action/i)).toBeInTheDocument()
  })
})

