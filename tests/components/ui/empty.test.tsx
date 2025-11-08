import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty'

describe('Empty Component', () => {
  it('should render empty component', () => {
    const { container } = render(<Empty>Empty state</Empty>)
    
    const empty = container.querySelector('[data-slot="empty"]')
    expect(empty).toBeInTheDocument()
  })

  it('should render empty header', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>Header content</EmptyHeader>
      </Empty>
    )
    
    const header = container.querySelector('[data-slot="empty-header"]')
    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent('Header content')
  })

  it('should render empty title', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>No items found</EmptyTitle>
      </Empty>
    )
    
    const title = container.querySelector('[data-slot="empty-title"]')
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('No items found')
  })

  it('should render empty description', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>Try adjusting your filters</EmptyDescription>
      </Empty>
    )
    
    const description = container.querySelector('[data-slot="empty-description"]')
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent('Try adjusting your filters')
  })

  it('should render empty content', () => {
    const { container } = render(
      <Empty>
        <EmptyContent>Content area</EmptyContent>
      </Empty>
    )
    
    const content = container.querySelector('[data-slot="empty-content"]')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Content area')
  })

  it('should render empty media with default variant', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia>
          <svg data-testid="icon" />
        </EmptyMedia>
      </Empty>
    )
    
    const media = container.querySelector('[data-slot="empty-icon"]')
    expect(media).toBeInTheDocument()
    expect(media).toHaveAttribute('data-variant', 'default')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('should render empty media with icon variant', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia variant="icon">
          <svg data-testid="icon" />
        </EmptyMedia>
      </Empty>
    )
    
    const media = container.querySelector('[data-slot="empty-icon"]')
    expect(media).toBeInTheDocument()
    expect(media).toHaveAttribute('data-variant', 'icon')
  })

  it('should render complete empty state', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <svg data-testid="icon" />
          </EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>Try a different search term</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button>Clear filters</button>
        </EmptyContent>
      </Empty>
    )
    
    expect(container.querySelector('[data-slot="empty-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="empty-title"]')).toHaveTextContent('No results')
    expect(container.querySelector('[data-slot="empty-description"]')).toHaveTextContent('Try a different search term')
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Empty className="custom-class">Empty state</Empty>)
    
    const empty = container.querySelector('[data-slot="empty"]')
    expect(empty).toHaveClass('custom-class')
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <Empty data-testid="empty" aria-label="Empty state">
        Empty content
      </Empty>
    )
    
    const empty = container.querySelector('[data-slot="empty"]')
    expect(empty).toHaveAttribute('data-testid', 'empty')
    expect(empty).toHaveAttribute('aria-label', 'Empty state')
  })
})

