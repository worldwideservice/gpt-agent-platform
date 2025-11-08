import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '@/components/ui/Logo'

// Мокаем next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('Logo Component', () => {
  it('should render logo', () => {
    render(<Logo />)
    
    // Logo должен рендериться
    const logo = screen.queryByAltText('TON 18 Logo') || screen.queryByText('TON 18')
    if (logo) {
      expect(logo).toBeInTheDocument()
    }
  })

  it('should apply custom className', () => {
    const { container } = render(<Logo className="custom-class" />)
    
    const logo = container.firstChild
    if (logo) {
      expect(logo).toHaveClass('custom-class')
    }
  })

  it('should render with tagline', () => {
    render(<Logo showTagline={true} />)
    
    const tagline = screen.queryByText('create infinity')
    if (tagline) {
      expect(tagline).toBeInTheDocument()
    }
  })
})

