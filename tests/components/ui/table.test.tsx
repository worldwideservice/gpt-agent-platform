import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/shadcn/table'

describe('Table Component', () => {
  it('should render table element', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByText(/cell content/i)).toBeInTheDocument()
  })

  it('should render table with header', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText(/header 1/i)).toBeInTheDocument()
    expect(screen.getByText(/header 2/i)).toBeInTheDocument()
    expect(screen.getByText(/cell 1/i)).toBeInTheDocument()
    expect(screen.getByText(/cell 2/i)).toBeInTheDocument()
  })

  it('should render table with footer', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(screen.getByText(/cell/i)).toBeInTheDocument()
    expect(screen.getByText(/footer/i)).toBeInTheDocument()
  })

  it('should render table with caption', () => {
    render(
      <Table>
        <TableCaption>Table caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText(/table caption/i)).toBeInTheDocument()
  })

  it('should apply custom className to table', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    const table = container.querySelector('table')
    expect(table).toHaveClass('custom-table')
  })

  it('should render multiple rows', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 3</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText(/row 1/i)).toBeInTheDocument()
    expect(screen.getByText(/row 2/i)).toBeInTheDocument()
    expect(screen.getByText(/row 3/i)).toBeInTheDocument()
  })

  it('should forward ref to table', () => {
    const ref = { current: null }
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })
})


