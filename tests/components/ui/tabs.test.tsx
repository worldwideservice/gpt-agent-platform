import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/shadcn/tabs'

describe('Tabs Component', () => {
  it('should render tabs with content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText(/tab 1/i)).toBeInTheDocument()
    expect(screen.getByText(/tab 2/i)).toBeInTheDocument()
    expect(screen.getByText(/content 1/i)).toBeInTheDocument()
  })

  it('should switch tabs on click', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    )

    const tab2 = screen.getByRole('tab', { name: /tab 2/i })
    await user.click(tab2)

    expect(screen.getByText(/content 2/i)).toBeInTheDocument()
  })

  it('should render tabs list', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument()
  })

  it('should render tabs content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1">Tab content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByText(/tab content/i)).toBeInTheDocument()
  })

  it('should apply custom className to tabs list', () => {
    const { container } = render(
      <Tabs>
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    const tabsList = container.querySelector('[role="tablist"]')
    expect(tabsList).toHaveClass('custom-tabs-list')
  })
})


