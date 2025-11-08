import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'

// Мокаем next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Breadcrumb Component', () => {
  it('should render breadcrumb', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const breadcrumb = container.querySelector('[data-slot="breadcrumb"]')
    expect(breadcrumb).toBeInTheDocument()
    expect(breadcrumb?.tagName).toBe('NAV')
    expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb')
  })

  it('should render breadcrumb list', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const list = container.querySelector('[data-slot="breadcrumb-list"]')
    expect(list).toBeInTheDocument()
    expect(list?.tagName).toBe('OL')
  })

  it('should render breadcrumb item', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const item = container.querySelector('[data-slot="breadcrumb-item"]')
    expect(item).toBeInTheDocument()
    expect(item?.tagName).toBe('LI')
  })

  it('should render breadcrumb link', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const link = container.querySelector('[data-slot="breadcrumb-link"]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveTextContent('Home')
  })

  it('should render breadcrumb page', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const page = container.querySelector('[data-slot="breadcrumb-page"]')
    expect(page).toBeInTheDocument()
    expect(page).toHaveAttribute('role', 'link')
    expect(page).toHaveAttribute('aria-current', 'page')
    expect(page).toHaveTextContent('Current Page')
  })

  it('should render breadcrumb separator', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Page</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const separator = container.querySelector('[data-slot="breadcrumb-separator"]')
    expect(separator).toBeInTheDocument()
  })

  it('should render breadcrumb ellipsis', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const ellipsis = container.querySelector('[data-slot="breadcrumb-ellipsis"]')
    expect(ellipsis).toBeInTheDocument()
  })

  it('should render complete breadcrumb navigation', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Current Product')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Breadcrumb className="custom-class">
        <BreadcrumbList>
          <BreadcrumbItem>Home</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    
    const breadcrumb = container.querySelector('[data-slot="breadcrumb"]')
    expect(breadcrumb).toHaveClass('custom-class')
  })
})

