import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render badge with default variant', () => {
    render(<Badge>Test Badge</Badge>)
    
    const badge = screen.getByText('Test Badge')
    expect(badge).toBeInTheDocument()
  })

  it('should render badge with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    
    const badge = screen.getByText('Secondary Badge')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-gray-100')
  })

  it('should render badge with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    
    const badge = screen.getByText('Destructive Badge')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-red-600')
  })

  it('should render badge with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    
    const badge = screen.getByText('Outline Badge')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('border-gray-300')
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    
    const badge = screen.getByText('Custom Badge')
    expect(badge.className).toContain('custom-class')
  })

  it('should render with children', () => {
    render(
      <Badge>
        <span>Badge Content</span>
      </Badge>
    )
    
    const badge = screen.getByText('Badge Content')
    expect(badge).toBeInTheDocument()
  })
})
