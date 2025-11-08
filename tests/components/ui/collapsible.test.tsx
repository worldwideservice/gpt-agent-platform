import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

describe('Collapsible Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render collapsible', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    const collapsible = container.querySelector('[data-slot="collapsible"]')
    expect(collapsible).toBeInTheDocument()
  })

  it('should render collapsible trigger', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    const trigger = container.querySelector('[data-slot="collapsible-trigger"]')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByText('Toggle')).toBeInTheDocument()
  })

  it('should render collapsible content', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    const content = container.querySelector('[data-slot="collapsible-content"]')
    expect(content).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should toggle content on trigger click', async () => {
    const user = userEvent.setup()
    
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    const trigger = screen.getByText('Toggle')
    await user.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  it('should render with default open state', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render controlled collapsible', () => {
    render(
      <Collapsible open={true}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render with button trigger', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button>Click me</button>
        </CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})

