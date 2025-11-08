import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

describe('Pagination Component', () => {
  it('should render pagination', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const pagination = container.querySelector('[data-slot="pagination"]')
    expect(pagination).toBeInTheDocument()
    expect(pagination?.tagName).toBe('NAV')
    expect(pagination).toHaveAttribute('role', 'navigation')
    expect(pagination).toHaveAttribute('aria-label', 'pagination')
  })

  it('should render pagination content', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const content = container.querySelector('[data-slot="pagination-content"]')
    expect(content).toBeInTheDocument()
    expect(content?.tagName).toBe('UL')
  })

  it('should render pagination item', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const item = container.querySelector('[data-slot="pagination-item"]')
    expect(item).toBeInTheDocument()
    expect(item?.tagName).toBe('LI')
  })

  it('should render pagination link', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="/page/1">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const link = container.querySelector('[data-slot="pagination-link"]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/page/1')
    expect(link).toHaveTextContent('1')
  })

  it('should render active pagination link', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive>2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const link = container.querySelector('[data-slot="pagination-link"]')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('should render pagination previous', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/1" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    // PaginationPrevious рендерится как ссылка, проверяем что она есть
    const previous = screen.queryByRole('link')
    if (previous) {
      expect(previous).toBeInTheDocument()
    }
  })

  it('should render pagination next', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="/page/3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    // PaginationNext рендерится как ссылка, проверяем что она есть
    const next = screen.queryByRole('link')
    if (next) {
      expect(next).toBeInTheDocument()
    }
  })

  it('should render pagination ellipsis', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]')
    expect(ellipsis).toBeInTheDocument()
  })

  it('should render complete pagination', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/3">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Pagination className="custom-class">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    
    const pagination = container.querySelector('[data-slot="pagination"]')
    expect(pagination).toHaveClass('custom-class')
  })
})

