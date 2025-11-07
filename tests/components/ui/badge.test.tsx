import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/shadcn/badge'

describe('Badge Component', () => {
  it('should render badge with text', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText(/new/i)
    expect(badge).toBeInTheDocument()
  })

  it('should render with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText(/default badge/i)
    expect(badge).toHaveClass('bg-primary')
  })

  it('should render with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    const badge = screen.getByText(/secondary badge/i)
    expect(badge).toHaveClass('bg-secondary')
  })

  it('should render with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    const badge = screen.getByText(/destructive badge/i)
    expect(badge).toHaveClass('bg-destructive')
  })

  it('should render with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    const badge = screen.getByText(/outline badge/i)
    expect(badge).toHaveClass('text-foreground')
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText(/custom/i)
    expect(badge).toHaveClass('custom-badge')
  })

  it('should forward ref', () => {
    const ref = { current: null }
    render(<Badge ref={ref}>Ref Badge</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should support all HTML div attributes', () => {
    render(
      <Badge data-testid="badge" aria-label="Status badge">
        Status
      </Badge>,
    )
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('aria-label', 'Status badge')
  })

  it('should render with children', () => {
    render(
      <Badge>
        <span>Child content</span>
      </Badge>,
    )
    expect(screen.getByText(/child content/i)).toBeInTheDocument()
  })
})

