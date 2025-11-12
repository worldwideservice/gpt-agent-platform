import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentUpdates } from '@/components/dashboard/RecentUpdates'

describe('RecentUpdates Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render recent updates', () => {
    const updates = [
      {
        id: '1',
        message: 'Test update 1',
        timestamp: '2025-01-26T10:00:00Z',
        color: 'green' as const,
      },
    ]

    render(<RecentUpdates updates={updates} />)
    
    expect(screen.getByText('Последние обновления')).toBeInTheDocument()
    expect(screen.getByText('Test update 1')).toBeInTheDocument()
  })

  it('should render empty state when no updates', () => {
    render(<RecentUpdates updates={[]} />)
    
    expect(screen.getByText('Последние обновления')).toBeInTheDocument()
    expect(screen.getByText('Нет обновлений')).toBeInTheDocument()
  })

  it('should render multiple updates', () => {
    const updates = [
      {
        id: '1',
        message: 'Update 1',
        timestamp: '2025-01-26T10:00:00Z',
        color: 'green' as const,
      },
      {
        id: '2',
        message: 'Update 2',
        timestamp: '2025-01-26T11:00:00Z',
        color: 'blue' as const,
      },
    ]

    render(<RecentUpdates updates={updates} />)
    
    expect(screen.getByText('Update 1')).toBeInTheDocument()
    expect(screen.getByText('Update 2')).toBeInTheDocument()
  })

  it('should apply correct color classes', () => {
    const updates = [
      {
        id: '1',
        message: 'Green update',
        timestamp: '2025-01-26T10:00:00Z',
        color: 'green' as const,
      },
      {
        id: '2',
        message: 'Blue update',
        timestamp: '2025-01-26T11:00:00Z',
        color: 'blue' as const,
      },
    ]

    const { container } = render(<RecentUpdates updates={updates} />)
    
    // Проверяем что цветовые классы применяются
    const indicators = container.querySelectorAll('[class*="bg-"]')
    expect(indicators.length).toBeGreaterThan(0)
  })
})
