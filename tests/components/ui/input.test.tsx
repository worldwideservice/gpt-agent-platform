import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui'

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
    // type="text" is default, but may not be explicitly set
    expect(input.tagName).toBe('INPUT')
  })

  it('should render with label', () => {
    render(<Input label="Email" placeholder="Enter email" />)
    expect(screen.getByText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<Input label="Password" description="Must be at least 8 characters" />)
    expect(screen.getByText(/password/i)).toBeInTheDocument()
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText(/enter text/i)
    await user.type(input, 'Hello World')

    expect(input).toHaveValue('Hello World')
  })

  it('should call onChange handler', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Input onChange={handleChange} placeholder="Enter text" />)

    const input = screen.getByPlaceholderText(/enter text/i)
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText(/disabled input/i)
    expect(input).toBeDisabled()
  })

  it('should support different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)
    let input = screen.getByPlaceholderText(/email/i)
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    input = screen.getByPlaceholderText(/password/i)
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number" />)
    input = screen.getByPlaceholderText(/number/i)
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should support required attribute', () => {
    render(<Input required placeholder="Required field" />)
    const input = screen.getByPlaceholderText(/required field/i)
    expect(input).toBeRequired()
  })

  it('should support value and defaultValue', () => {
    const { rerender } = render(<Input defaultValue="Default value" />)
    let input = screen.getByDisplayValue(/default value/i)
    expect(input).toBeInTheDocument()

    rerender(<Input value="Controlled value" onChange={() => {}} />)
    input = screen.getByDisplayValue(/controlled value/i)
    expect(input).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />)
    const input = screen.getByPlaceholderText(/custom/i)
    expect(input).toHaveClass('custom-input')
  })

  it('should forward ref', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Ref input" />)
    expect(ref).toHaveBeenCalled()
  })

  it('should support aria attributes', () => {
    render(<Input aria-label="Search input" placeholder="Search" />)
    const input = screen.getByLabelText(/search input/i)
    expect(input).toBeInTheDocument()
  })

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="Limited input" />)
    const input = screen.getByPlaceholderText(/limited input/i)
    expect(input).toHaveAttribute('maxLength', '10')
  })

  it('should support pattern attribute', () => {
    render(<Input pattern="[0-9]*" placeholder="Numbers only" />)
    const input = screen.getByPlaceholderText(/numbers only/i)
    expect(input).toHaveAttribute('pattern', '[0-9]*')
  })
})

