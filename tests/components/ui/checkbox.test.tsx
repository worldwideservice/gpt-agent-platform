import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render checkbox', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('should be unchecked by default', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('should be checked when checked prop is true', () => {
    render(<Checkbox checked />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should toggle on click', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = vi.fn()
    
    render(<Checkbox onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('should not toggle when disabled', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = vi.fn()
    
    render(<Checkbox disabled onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(handleCheckedChange).not.toHaveBeenCalled()
  })

  it('should support controlled mode', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = vi.fn()
    
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    await user.click(checkbox)
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
    
    rerender(<Checkbox checked={true} onCheckedChange={handleCheckedChange} />)
    expect(checkbox).toBeChecked()
  })
})

