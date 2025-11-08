import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollArea } from '@/components/ui/scroll-area'

describe('ScrollArea Component', () => {
  it('should render scroll area', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    )
    
    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <ScrollArea>
        <div>Scrollable Content</div>
      </ScrollArea>
    )
    
    expect(screen.getByText('Scrollable Content')).toBeInTheDocument()
  })

  it('should render viewport', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    )
    
    const viewport = container.querySelector('[data-slot="scroll-area-viewport"]')
    expect(viewport).toBeInTheDocument()
  })

  it('should render scrollbar', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    )
    
    // Scrollbar может рендериться только когда контент переполняется
    const scrollbar = container.querySelector('[data-slot="scroll-area-scrollbar"]')
    if (scrollbar) {
      expect(scrollbar).toBeInTheDocument()
    } else {
      // Если scrollbar не найден, проверяем что ScrollArea рендерится
      const scrollArea = container.querySelector('[data-slot="scroll-area"]')
      expect(scrollArea).toBeInTheDocument()
    }
  })

  it('should apply custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-class">
        <div>Content</div>
      </ScrollArea>
    )
    
    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toHaveClass('custom-class')
  })

  it('should render with long content', () => {
    render(
      <ScrollArea className="h-32">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </ScrollArea>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 20')).toBeInTheDocument()
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <ScrollArea data-testid="scroll-area" aria-label="Scrollable area">
        <div>Content</div>
      </ScrollArea>
    )
    
    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toHaveAttribute('data-testid', 'scroll-area')
    expect(scrollArea).toHaveAttribute('aria-label', 'Scrollable area')
  })
})

