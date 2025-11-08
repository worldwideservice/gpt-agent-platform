import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/Button'

describe('ButtonGroup Component', () => {
  it('should render button group', () => {
    render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    )
    
    expect(screen.getByText('Button 1')).toBeInTheDocument()
    expect(screen.getByText('Button 2')).toBeInTheDocument()
  })

  it('should apply horizontal orientation', () => {
    const { container } = render(
      <ButtonGroup orientation="horizontal">
        <Button>Button</Button>
      </ButtonGroup>
    )
    
    const group = container.querySelector('[data-slot="button-group"]')
    expect(group).toBeInTheDocument()
    expect(group).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <ButtonGroup className="custom-class">
        <Button>Button</Button>
      </ButtonGroup>
    )
    
    const group = container.querySelector('[data-slot="button-group"]')
    if (group) {
      expect(group).toHaveClass('custom-class')
    }
  })
})

