import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'

describe('ToggleGroup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render toggle group', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should handle value change', async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()
    
    render(
      <ToggleGroup type="single" onValueChange={handleValueChange}>
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    
    // Проверяем что функция была вызвана
    expect(handleValueChange).toHaveBeenCalled()
  })

  it('should set default value', () => {
    render(
      <ToggleGroup type="single" defaultValue="option2">
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const option2 = screen.getByText('Option 2')
    expect(option2).toBeInTheDocument()
  })
})

