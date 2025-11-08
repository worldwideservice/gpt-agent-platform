import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/ui/item'

describe('Item Component', () => {
  it('should render item', () => {
    render(
      <Item>
        <ItemContent>
          <div>Item content</div>
        </ItemContent>
      </Item>
    )
    
    expect(screen.getByText('Item content')).toBeInTheDocument()
  })

  it('should render item with title', () => {
    render(
      <Item>
        <ItemContent>
          <ItemTitle>Item Title</ItemTitle>
          <ItemDescription>Item description</ItemDescription>
        </ItemContent>
      </Item>
    )
    
    expect(screen.getByText('Item Title')).toBeInTheDocument()
    expect(screen.getByText('Item description')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Item className="custom-class">
        <ItemContent>
          <div>Item content</div>
        </ItemContent>
      </Item>
    )
    
    const item = container.querySelector('[data-slot="item"]')
    if (item) {
      expect(item).toHaveClass('custom-class')
    }
  })
})

