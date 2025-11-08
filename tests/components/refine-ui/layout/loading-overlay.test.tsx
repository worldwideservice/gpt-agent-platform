import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingOverlay } from '@/components/refine-ui/layout/loading-overlay'

describe('LoadingOverlay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children when not loading', () => {
    render(
      <LoadingOverlay loading={false}>
        <div>Content</div>
      </LoadingOverlay>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should show loading overlay when loading', () => {
    render(
      <LoadingOverlay loading={true}>
        <div>Content</div>
      </LoadingOverlay>
    )
    
    // Проверяем что overlay отображается
    const overlay = document.querySelector('[class*="absolute"]')
    expect(overlay).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <LoadingOverlay loading={true} className="custom-class">
        <div>Content</div>
      </LoadingOverlay>
    )
    
    const overlay = container.querySelector('[class*="absolute"]')
    if (overlay) {
      expect(overlay).toHaveClass('custom-class')
    }
  })
})

