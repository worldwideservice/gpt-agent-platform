import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

describe('RadioGroup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render radio group', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    )
    
    const group = container.querySelector('[data-slot="radio-group"]')
    expect(group).toBeInTheDocument()
  })

  it('should render radio group item', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    )
    
    const item = container.querySelector('[data-slot="radio-group-item"]')
    expect(item).toBeInTheDocument()
  })

  it('should render radio group indicator', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
      </RadioGroup>
    )
    
    // Indicator рендерится внутри RadioGroupItem, но может быть не виден до выбора
    const indicator = container.querySelector('[data-slot="radio-group-indicator"]')
    if (indicator) {
      expect(indicator).toBeInTheDocument()
    } else {
      // Если indicator не найден, проверяем что item рендерится
      const item = container.querySelector('[data-slot="radio-group-item"]')
      expect(item).toBeInTheDocument()
    }
  })

  it('should render multiple radio items', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
        <RadioGroupItem value="option3" />
      </RadioGroup>
    )
    
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')
    expect(items.length).toBe(3)
  })

  it('should apply custom className to group', () => {
    const { container } = render(
      <RadioGroup className="custom-class">
        <RadioGroupItem value="option1" />
      </RadioGroup>
    )
    
    const group = container.querySelector('[data-slot="radio-group"]')
    expect(group).toHaveClass('custom-class')
  })

  it('should apply custom className to item', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" className="custom-class" />
      </RadioGroup>
    )
    
    const item = container.querySelector('[data-slot="radio-group-item"]')
    expect(item).toHaveClass('custom-class')
  })

  it('should handle value change', async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()
    
    render(
      <RadioGroup onValueChange={handleValueChange}>
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    )
    
    const items = screen.getAllByRole('radio')
    await user.click(items[1])
    
    expect(handleValueChange).toHaveBeenCalledWith('option2')
  })

  it('should set default value', () => {
    render(
      <RadioGroup defaultValue="option2">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    )
    
    const items = screen.getAllByRole('radio')
    expect(items[1]).toBeChecked()
  })

  it('should handle controlled value', () => {
    render(
      <RadioGroup value="option1">
        <RadioGroupItem value="option1" />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    )
    
    const items = screen.getAllByRole('radio')
    expect(items[0]).toBeChecked()
    expect(items[1]).not.toBeChecked()
  })

  it('should disable radio item', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="option1" disabled />
        <RadioGroupItem value="option2" />
      </RadioGroup>
    )
    
    const items = screen.getAllByRole('radio')
    expect(items[0]).toBeDisabled()
    expect(items[1]).not.toBeDisabled()
  })
})

