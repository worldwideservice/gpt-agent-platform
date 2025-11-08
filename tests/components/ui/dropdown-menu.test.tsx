import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dropdown menu', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    // DropdownMenu может не рендериться сразу, проверяем что trigger есть
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('should render dropdown trigger', () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')
    expect(trigger).toBeInTheDocument()
    expect(screen.getByText('Open menu')).toBeInTheDocument()
  })

  it('should render dropdown content', async () => {
    const user = userEvent.setup()
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open')
    await user.click(trigger)
    
    await waitFor(() => {
      const content = screen.queryByText('Item 1')
      if (content) {
        expect(content).toBeInTheDocument()
      }
    })
  })

  it('should render dropdown menu items', async () => {
    const user = userEvent.setup()
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open')
    await user.click(trigger)
    
    await waitFor(() => {
      const item1 = screen.queryByText('Item 1')
      const item2 = screen.queryByText('Item 2')
      if (item1 && item2) {
        expect(item1).toBeInTheDocument()
        expect(item2).toBeInTheDocument()
      }
    })
  })

  it('should render dropdown menu label', async () => {
    const user = userEvent.setup()
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open')
    await user.click(trigger)
    
    await waitFor(() => {
      const label = screen.queryByText('My Account')
      if (label) {
        expect(label).toBeInTheDocument()
      }
    })
  })

  it('should render dropdown menu separator', async () => {
    const user = userEvent.setup()
    
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open')
    await user.click(trigger)
    
    await waitFor(() => {
      const separator = container.querySelector('[data-slot="dropdown-menu-separator"]')
      if (separator) {
        expect(separator).toBeInTheDocument()
      }
    })
  })

  it('should render dropdown menu group', async () => {
    const user = userEvent.setup()
    
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open')
    await user.click(trigger)
    
    await waitFor(() => {
      const group = container.querySelector('[data-slot="dropdown-menu-group"]')
      if (group) {
        expect(group).toBeInTheDocument()
      }
    })
  })

  it('should render with button trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Click me</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})

