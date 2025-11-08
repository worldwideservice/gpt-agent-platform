import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

describe('Kbd Component', () => {
  it('should render kbd element', () => {
    const { container } = render(<Kbd>Ctrl</Kbd>)
    
    const kbd = container.querySelector('[data-slot="kbd"]')
    expect(kbd).toBeInTheDocument()
    expect(kbd?.tagName).toBe('KBD')
  })

  it('should render kbd text', () => {
    render(<Kbd>Ctrl</Kbd>)
    
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    const { container } = render(<Kbd>Ctrl</Kbd>)
    
    const kbd = container.querySelector('[data-slot="kbd"]')
    expect(kbd).toHaveClass('bg-muted', 'text-muted-foreground', 'rounded-sm')
  })

  it('should apply custom className', () => {
    const { container } = render(<Kbd className="custom-class">Ctrl</Kbd>)
    
    const kbd = container.querySelector('[data-slot="kbd"]')
    expect(kbd).toHaveClass('custom-class')
  })

  it('should render multiple keys', () => {
    render(
      <div>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>K</Kbd>
      </div>
    )
    
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('Shift')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(<Kbd data-testid="kbd" aria-label="Keyboard shortcut">Ctrl</Kbd>)
    
    const kbd = container.querySelector('[data-slot="kbd"]')
    expect(kbd).toHaveAttribute('data-testid', 'kbd')
    expect(kbd).toHaveAttribute('aria-label', 'Keyboard shortcut')
  })

  it('should render with icon', () => {
    const { container } = render(
      <Kbd>
        <svg data-testid="icon" />
        Ctrl
      </Kbd>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
  })
})

describe('KbdGroup Component', () => {
  it('should render kbd group', () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    )
    
    const group = container.querySelector('[data-slot="kbd-group"]')
    expect(group).toBeInTheDocument()
  })

  it('should render multiple kbd elements in group', () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    )
    
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('Shift')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
      </KbdGroup>
    )
    
    const group = container.querySelector('[data-slot="kbd-group"]')
    expect(group).toHaveClass('inline-flex', 'items-center', 'gap-1')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <KbdGroup className="custom-class">
        <Kbd>Ctrl</Kbd>
      </KbdGroup>
    )
    
    const group = container.querySelector('[data-slot="kbd-group"]')
    expect(group).toHaveClass('custom-class')
  })

  it('should render keyboard shortcut combination', () => {
    render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    )
    
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })
})

