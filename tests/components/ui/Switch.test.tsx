import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '@/components/ui/switch'

describe('Switch Component', () => {
  it('should render switch', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    render(<Switch checked={true} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('should be unchecked when checked prop is false', () => {
    render(<Switch checked={false} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
  })

  it('should call onCheckedChange when clicked', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Switch checked={false} onCheckedChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Switch disabled={true} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
  })

  it('should not call onCheckedChange when disabled', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Switch disabled={true} checked={false} onCheckedChange={handleChange} />)
    
    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Switch className="custom-class" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-class')
  })
})

