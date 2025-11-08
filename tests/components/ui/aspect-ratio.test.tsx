import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

describe('AspectRatio Component', () => {
  it('should render aspect ratio', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <div>Content</div>
      </AspectRatio>
    )
    
    const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]')
    expect(aspectRatio).toBeInTheDocument()
  })

  it('should apply custom ratio', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <div>Content</div>
      </AspectRatio>
    )
    
    const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]')
    expect(aspectRatio).toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <div>Test Content</div>
      </AspectRatio>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} className="custom-class">
        <div>Content</div>
      </AspectRatio>
    )
    
    const aspectRatio = container.querySelector('[data-slot="aspect-ratio"]')
    expect(aspectRatio).toHaveClass('custom-class')
  })
})

