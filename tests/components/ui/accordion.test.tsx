import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

describe('Accordion Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render accordion', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const accordion = container.querySelector('[data-slot="accordion"]')
    expect(accordion).toBeInTheDocument()
  })

  it('should render accordion item', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const item = container.querySelector('[data-slot="accordion-item"]')
    expect(item).toBeInTheDocument()
  })

  it('should render accordion trigger', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const trigger = container.querySelector('[data-slot="accordion-trigger"]')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('should render accordion content', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const content = container.querySelector('[data-slot="accordion-content"]')
    expect(content).toBeInTheDocument()
  })

  it('should toggle accordion item on trigger click', async () => {
    const user = userEvent.setup()
    
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const trigger = screen.getByText('Item 1')
    await user.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })
  })

  it('should render multiple accordion items', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should apply custom className to item', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1" className="custom-class">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    const item = container.querySelector('[data-slot="accordion-item"]')
    expect(item).toHaveClass('custom-class')
  })

  it('should render with default open value', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})

