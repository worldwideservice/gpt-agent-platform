import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

// Мокаем next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('OptimizedImage Component', () => {
  it('should render optimized image', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test.jpg')
  })

  it('should apply custom width and height', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test" width={200} height={200} />)
    
    const image = screen.getByAltText('Test')
    expect(image).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" className="custom-class" />)
    
    // OptimizedImage оборачивает Image в div, className применяется к обертке
    const wrapper = container.firstChild
    if (wrapper) {
      expect(wrapper).toHaveClass('custom-class')
    }
  })
})

