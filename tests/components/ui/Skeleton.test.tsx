import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/Skeleton'

describe('Skeleton Component', () => {
  it('should render skeleton', () => {
    const { container } = render(<Skeleton />)
    
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    const { container } = render(<Skeleton />)
    
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md')
  })

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('custom-class')
  })

  it('should render with children', () => {
    render(
      <Skeleton>
        <div>Loading...</div>
      </Skeleton>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(<Skeleton data-testid="skeleton" aria-label="Loading" />)
    
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveAttribute('data-testid', 'skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render with custom width and height', () => {
    const { container } = render(<Skeleton className="w-20 h-10" />)
    
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('w-20', 'h-10')
  })

  it('should render multiple skeletons', () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
    
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBe(3)
  })
})

