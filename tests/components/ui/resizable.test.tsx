import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

describe('Resizable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render resizable panel group', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    )
    
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('should render resizable panel', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50}>Content</ResizablePanel>
      </ResizablePanelGroup>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render resizable handle', () => {
    const { container } = render(
      <ResizablePanelGroup>
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    )
    
    const handle = container.querySelector('[data-slot="resizable-handle"]')
    expect(handle).toBeInTheDocument()
  })
})

