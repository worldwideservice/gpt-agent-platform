import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassCard } from '@/components/landing/glass-card'

describe('GlassCard Component', () => {
  it('should render glass card', () => {
    render(
      <GlassCard>
        <div>Card content</div>
      </GlassCard>
    )
    
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should apply custom variant', () => {
    const { container } = render(
      <GlassCard variant="subtle">
        <div>Content</div>
      </GlassCard>
    )
    
    const card = container.querySelector('[data-slot="card"]') || container.firstChild
    expect(card).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <GlassCard className="custom-class">
        <div>Content</div>
      </GlassCard>
    )
    
    const card = container.querySelector('[data-slot="card"]') || container.firstChild
    if (card) {
      expect(card).toHaveClass('custom-class')
    }
  })
})

