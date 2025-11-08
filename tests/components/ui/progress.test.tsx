import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress Component', () => {
  it('should render progress', () => {
    const { container } = render(<Progress value={50} />)
    
    const progress = container.querySelector('[data-slot="progress"]')
    expect(progress).toBeInTheDocument()
  })

  it('should render progress indicator', () => {
    const { container } = render(<Progress value={50} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toBeInTheDocument()
  })

  it('should apply default value of 0', () => {
    const { container } = render(<Progress />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('should set progress to 0%', () => {
    const { container } = render(<Progress value={0} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('should set progress to 50%', () => {
    const { container } = render(<Progress value={50} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' })
  })

  it('should set progress to 100%', () => {
    const { container } = render(<Progress value={100} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' })
  })

  it('should apply custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />)
    
    const progress = container.querySelector('[data-slot="progress"]')
    expect(progress).toHaveClass('custom-class')
  })

  it('should handle values over 100', () => {
    const { container } = render(<Progress value={150} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    // Значение должно быть ограничено, но компонент может обработать его
    expect(indicator).toBeInTheDocument()
  })

  it('should handle negative values', () => {
    const { container } = render(<Progress value={-10} />)
    
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toBeInTheDocument()
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <Progress value={50} data-testid="progress" aria-label="Loading progress" />
    )
    
    const progress = container.querySelector('[data-slot="progress"]')
    expect(progress).toHaveAttribute('data-testid', 'progress')
    expect(progress).toHaveAttribute('aria-label', 'Loading progress')
  })
})

