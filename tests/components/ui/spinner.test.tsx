import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '@/components/ui/spinner'

describe('Spinner Component', () => {
  it('should render spinner', () => {
    render(<Spinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('should have loading aria-label', () => {
    render(<Spinner />)
    
    const spinner = screen.getByLabelText('Loading')
    expect(spinner).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('size-4', 'animate-spin')
  })

  it('should apply custom className', () => {
    const { container } = render(<Spinner className="custom-class" />)
    
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('custom-class')
  })

  it('should pass through HTML attributes', () => {
    render(<Spinner data-testid="spinner" aria-label="Custom loading" />)
    
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toHaveAttribute('aria-label', 'Custom loading')
  })

  it('should render as SVG element', () => {
    const { container } = render(<Spinner />)
    
    const spinner = container.querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner?.tagName).toBe('svg')
  })

  it('should have role="status"', () => {
    render(<Spinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })
})

