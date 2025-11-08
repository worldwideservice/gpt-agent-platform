import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label Component', () => {
  it('should render label', () => {
    render(<Label>Test Label</Label>)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render as label element', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label.tagName).toBe('LABEL')
  })

  it('should apply htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'input-id')
  })

  it('should apply default classes', () => {
    const { container } = render(<Label>Test Label</Label>)
    
    const label = container.querySelector('label')
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
  })

  it('should apply custom className', () => {
    const { container } = render(<Label className="custom-class">Test Label</Label>)
    
    const label = container.querySelector('label')
    expect(label).toHaveClass('custom-class')
  })

  it('should pass through HTML attributes', () => {
    render(<Label data-testid="label" aria-label="Test">Test Label</Label>)
    
    const label = screen.getByTestId('label')
    expect(label).toHaveAttribute('aria-label', 'Test')
  })

  it('should render with complex children', () => {
    render(
      <Label>
        <span>Required</span> Field Name
      </Label>
    )
    
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByText('Field Name')).toBeInTheDocument()
  })

  it('should work with form inputs', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </div>
    )
    
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })
})

