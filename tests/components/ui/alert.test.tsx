import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

describe('Alert Component', () => {
  it('should render alert', () => {
    const { container } = render(<Alert>Alert content</Alert>)
    
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveAttribute('role', 'alert')
  })

  it('should render with default variant', () => {
    const { container } = render(<Alert>Alert content</Alert>)
    
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toHaveClass('bg-card', 'text-card-foreground')
  })

  it('should render with destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error alert</Alert>)
    
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toHaveClass('text-destructive', 'bg-card')
  })

  it('should render alert title', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>
    )
    
    const title = container.querySelector('[data-slot="alert-title"]')
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Alert Title')
  })

  it('should render alert description', () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    )
    
    const description = container.querySelector('[data-slot="alert-description"]')
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent('Alert description')
  })

  it('should render complete alert with title and description', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>
    )
    
    expect(container.querySelector('[data-slot="alert-title"]')).toHaveTextContent('Alert Title')
    expect(container.querySelector('[data-slot="alert-description"]')).toHaveTextContent('Alert description text')
  })

  it('should apply custom className', () => {
    const { container } = render(<Alert className="custom-class">Alert content</Alert>)
    
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toHaveClass('custom-class')
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <Alert data-testid="alert" aria-label="Test alert">
        Alert content
      </Alert>
    )
    
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toHaveAttribute('data-testid', 'alert')
    expect(alert).toHaveAttribute('aria-label', 'Test alert')
  })

  it('should render with icon', () => {
    const { container } = render(
      <Alert>
        <svg data-testid="icon" />
        <AlertTitle>Alert with icon</AlertTitle>
      </Alert>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="alert-title"]')).toBeInTheDocument()
  })
})

