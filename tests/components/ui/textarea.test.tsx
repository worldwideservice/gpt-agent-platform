import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui'

describe('Textarea Component', () => {
  it('should render textarea element', () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText(/enter text/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('should render with label', () => {
    render(<Textarea label="Description" placeholder="Enter description" />)
    expect(screen.getByText(/description/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter description/i)).toBeInTheDocument()
  })

  it('should render with description', () => {
    render(<Textarea label="Comments" description="Please provide detailed feedback" />)
    expect(screen.getByText(/comments/i)).toBeInTheDocument()
    expect(screen.getByText(/please provide detailed feedback/i)).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Textarea placeholder="Enter text" />)

    const textarea = screen.getByPlaceholderText(/enter text/i)
    await user.type(textarea, 'Hello World\nThis is a test')

    expect(textarea).toHaveValue('Hello World\nThis is a test')
  })

  it('should call onChange handler', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<Textarea onChange={handleChange} placeholder="Enter text" />)

    const textarea = screen.getByPlaceholderText(/enter text/i)
    await user.type(textarea, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)
    const textarea = screen.getByPlaceholderText(/disabled textarea/i)
    expect(textarea).toBeDisabled()
  })

  it('should support required attribute', () => {
    render(<Textarea required placeholder="Required field" />)
    const textarea = screen.getByPlaceholderText(/required field/i)
    expect(textarea).toBeRequired()
  })

  it('should support rows attribute', () => {
    render(<Textarea rows={5} placeholder="5 rows" />)
    const textarea = screen.getByPlaceholderText(/5 rows/i)
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('should support cols attribute', () => {
    render(<Textarea cols={50} placeholder="50 cols" />)
    const textarea = screen.getByPlaceholderText(/50 cols/i)
    expect(textarea).toHaveAttribute('cols', '50')
  })

  it('should support maxLength attribute', () => {
    render(<Textarea maxLength={100} placeholder="Limited textarea" />)
    const textarea = screen.getByPlaceholderText(/limited textarea/i)
    expect(textarea).toHaveAttribute('maxLength', '100')
  })

  it('should support value and defaultValue', () => {
    const { rerender } = render(<Textarea defaultValue="Default value" />)
    let textarea = screen.getByDisplayValue(/default value/i)
    expect(textarea).toBeInTheDocument()

    rerender(<Textarea value="Controlled value" onChange={() => {}} />)
    textarea = screen.getByDisplayValue(/controlled value/i)
    expect(textarea).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" placeholder="Custom" />)
    const textarea = screen.getByPlaceholderText(/custom/i)
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('should forward ref', () => {
    const ref = vi.fn()
    render(<Textarea ref={ref} placeholder="Ref textarea" />)
    expect(ref).toHaveBeenCalled()
  })

  it('should support aria attributes', () => {
    render(<Textarea aria-label="Comment textarea" placeholder="Comment" />)
    const textarea = screen.getByLabelText(/comment textarea/i)
    expect(textarea).toBeInTheDocument()
  })

  it('should support placeholder attribute', () => {
    render(<Textarea placeholder="Enter your message here" />)
    const textarea = screen.getByPlaceholderText(/enter your message here/i)
    expect(textarea).toBeInTheDocument()
  })
})

