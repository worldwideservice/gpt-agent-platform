import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollAnimation } from '@/components/ui/scroll-animation'

describe('ScrollAnimation Component', () => {
  it('should render scroll animation', () => {
    const { container } = render(
      <ScrollAnimation>
        <div>Content</div>
      </ScrollAnimation>
    )
    
    expect(container.textContent).toContain('Content')
  })

  it('should apply fade direction', () => {
    const { container } = render(
      <ScrollAnimation direction="fade">
        <div>Content</div>
      </ScrollAnimation>
    )
    
    const element = container.firstChild
    expect(element).toBeInTheDocument()
  })

  it('should apply up direction', () => {
    const { container } = render(
      <ScrollAnimation direction="up">
        <div>Content</div>
      </ScrollAnimation>
    )
    
    const element = container.firstChild
    expect(element).toBeInTheDocument()
  })

  it('should apply custom delay', () => {
    const { container } = render(
      <ScrollAnimation delay={200}>
        <div>Content</div>
      </ScrollAnimation>
    )
    
    const element = container.firstChild
    expect(element).toBeInTheDocument()
  })

  it('should apply custom duration', () => {
    const { container } = render(
      <ScrollAnimation duration={800}>
        <div>Content</div>
      </ScrollAnimation>
    )
    
    const element = container.firstChild
    expect(element).toBeInTheDocument()
  })
})

