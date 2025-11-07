import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/shadcn/card'

describe('Card Component', () => {
  it('should render card element', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText(/card content/i)
    expect(card).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('custom-card')
  })

  it('should forward ref', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should render CardHeader', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>,
    )
    expect(screen.getByText(/header content/i)).toBeInTheDocument()
  })

  it('should render CardTitle', () => {
    render(
      <Card>
        <CardTitle>Card Title</CardTitle>
      </Card>,
    )
    const title = screen.getByText(/card title/i)
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H3')
  })

  it('should render CardDescription', () => {
    render(
      <Card>
        <CardDescription>Card description text</CardDescription>
      </Card>,
    )
    expect(screen.getByText(/card description text/i)).toBeInTheDocument()
  })

  it('should render CardContent', () => {
    render(
      <Card>
        <CardContent>Card content text</CardContent>
      </Card>,
    )
    expect(screen.getByText(/card content text/i)).toBeInTheDocument()
  })

  it('should render CardFooter', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    )
    expect(screen.getByText(/footer content/i)).toBeInTheDocument()
  })

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title Text</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <CardContent>Main content goes here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    )

    expect(screen.getByText(/card title text/i)).toBeInTheDocument()
    expect(screen.getByText(/card description text/i)).toBeInTheDocument()
    expect(screen.getByText(/main content goes here/i)).toBeInTheDocument()
    expect(screen.getByText(/footer actions/i)).toBeInTheDocument()
  })

  it('should support all HTML div attributes', () => {
    render(
      <Card data-testid="card" aria-label="Test card">
        Content
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('aria-label', 'Test card')
  })
})

