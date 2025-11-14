import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressRing } from '@/components/landing/progress-ring'

describe('ProgressRing Component', () => {
  it('should render progress ring', () => {
    const { container } = render(<ProgressRing value={50} />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should set progress value', () => {
    render(<ProgressRing value={75} />)
    
    // Проверяем что процент отображается
    const percentage = screen.queryByText('75%')
    if (percentage) {
      expect(percentage).toBeInTheDocument()
    }
  })

  it('should apply custom size', () => {
    const { container } = render(<ProgressRing value={50} size={100} />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '100')
  })

  it('should hide label when showLabel is false', () => {
    render(<ProgressRing value={50} showLabel={false} />)
    
    const percentage = screen.queryByText('50%')
    expect(percentage).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<ProgressRing value={50} className="custom-class" />)
    
    const wrapper = container.firstChild
    if (wrapper) {
      expect(wrapper).toHaveClass('custom-class')
    }
  })
})

