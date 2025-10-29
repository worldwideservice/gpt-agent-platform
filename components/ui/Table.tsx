import type { HTMLAttributes, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export const Table = ({ className, children, ...props }: TableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full border-collapse bg-white', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export const TableHeader = ({ className, children, ...props }: TableHeaderProps) => {
  return (
    <thead className={cn('bg-slate-50 border-b border-slate-200', className)} {...props}>
      {children}
    </thead>
  )
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export const TableBody = ({ className, children, ...props }: TableBodyProps) => {
  return (
    <tbody className={cn('divide-y divide-slate-100', className)} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export const TableRow = ({ className, children, ...props }: TableRowProps) => {
  return (
    <tr className={cn('hover:bg-slate-50 transition-colors border-b border-slate-100', className)} {...props}>
      {children}
    </tr>
  )
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export const TableHead = ({ className, children, ...props }: TableHeadProps) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export const TableCell = ({ className, children, ...props }: TableCellProps) => {
  return (
    <td className={cn('px-6 py-4 text-sm text-slate-900', className)} {...props}>
      {children}
    </td>
  )
}
