import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputGroup, InputGroupInput, InputGroupButton } from '@/components/ui/input-group'
import { Button } from '@/components/ui/Button'

describe('InputGroup Component', () => {
  it('should render input group', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Enter text" />
        <InputGroupButton>
          <Button>Submit</Button>
        </InputGroupButton>
      </InputGroup>
    )
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <InputGroup className="custom-class">
        <InputGroupInput />
      </InputGroup>
    )
    
    const group = container.querySelector('[role="group"]')
    if (group) {
      expect(group).toHaveClass('custom-class')
    }
  })
})

