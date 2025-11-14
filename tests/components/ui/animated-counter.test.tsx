import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedCounter } from '@/components/landing/animated-counter'

describe('AnimatedCounter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render animated counter', () => {
    const { container } = render(<AnimatedCounter value={100} />)
    
    // Компонент должен рендериться
    const counter = container.firstChild
    expect(counter).toBeInTheDocument()
  })

  it('should render with prefix', () => {
    const { container } = render(<AnimatedCounter value={100} prefix="$" />)
    
    const counter = container.firstChild
    expect(counter).toBeInTheDocument()
    expect(container.textContent).toContain('$')
  })

  it('should render with suffix', () => {
    const { container } = render(<AnimatedCounter value={100} suffix="+" />)
    
    const counter = container.firstChild
    expect(counter).toBeInTheDocument()
    expect(container.textContent).toContain('+')
  })

  it('should apply custom className', () => {
    const { container } = render(<AnimatedCounter value={100} className="custom-class" />)
    
    const counter = container.firstChild
    expect(counter).toHaveClass('custom-class')
  })
})

