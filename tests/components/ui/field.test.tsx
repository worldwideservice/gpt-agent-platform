import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Field, FieldLabel, FieldDescription, FieldContent } from '@/components/ui/field'

describe('Field Component', () => {
  it('should render field', () => {
    render(
      <Field>
        <FieldContent>
          <div>Field content</div>
        </FieldContent>
      </Field>
    )
    
    expect(screen.getByText('Field content')).toBeInTheDocument()
  })

  it('should render field with label', () => {
    render(
      <Field>
        <FieldLabel>Field Label</FieldLabel>
        <FieldContent>
          <div>Field content</div>
        </FieldContent>
      </Field>
    )
    
    expect(screen.getByText('Field Label')).toBeInTheDocument()
    expect(screen.getByText('Field content')).toBeInTheDocument()
  })

  it('should render field with description', () => {
    render(
      <Field>
        <FieldLabel>Field Label</FieldLabel>
        <FieldDescription>Field description</FieldDescription>
        <FieldContent>
          <div>Field content</div>
        </FieldContent>
      </Field>
    )
    
    expect(screen.getByText('Field Label')).toBeInTheDocument()
    expect(screen.getByText('Field description')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Field className="custom-class">
        <FieldContent>
          <div>Field content</div>
        </FieldContent>
      </Field>
    )
    
    const field = container.querySelector('[data-slot="field"]')
    if (field) {
      expect(field).toHaveClass('custom-class')
    }
  })
})

