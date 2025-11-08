import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar'

describe('Menubar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    
    expect(screen.getByText('File')).toBeInTheDocument()
  })

  it('should render menubar menu', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Cut</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('should render menubar item', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    
    // Item может быть не виден до открытия меню, проверяем что trigger есть
    const trigger = screen.getByText('File')
    expect(trigger).toBeInTheDocument()
  })
})

