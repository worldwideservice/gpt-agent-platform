import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/dashboard/StatCard'
import { Users, TrendingUp } from 'lucide-react'

describe('StatCard Component', () => {
  it('should render stat card with title and value', () => {
    render(<StatCard title="Total Users" value={1000} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1 000')).toBeInTheDocument()
  })

  it('should format large numbers correctly', () => {
    render(<StatCard title="Revenue" value={1234567} />)
    
    expect(screen.getByText('1 234 567')).toBeInTheDocument()
  })

  it('should handle string values', () => {
    render(<StatCard title="Status" value="Active" />)
    
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should display positive change with green color', () => {
    render(<StatCard title="Growth" value={100} change={15.5} />)
    
    const changeElement = screen.getByText(/\+15\.5%/i)
    expect(changeElement).toBeInTheDocument()
    expect(changeElement.closest('div')).toHaveClass('text-green-600')
  })

  it('should display negative change with red color', () => {
    render(<StatCard title="Decline" value={100} change={-5.3} />)
    
    const changeElement = screen.getByText(/-5\.3%/i)
    expect(changeElement).toBeInTheDocument()
    expect(changeElement.closest('div')).toHaveClass('text-red-600')
  })

  it('should display zero change', () => {
    render(<StatCard title="Stable" value={100} change={0} />)
    
    // Проверяем, что изменение отображается (может быть +0.0% или просто 0%)
    const changeElement = screen.queryByText(/\+?0\.0%/i) || screen.queryByText(/0%/i)
    expect(changeElement).toBeInTheDocument()
  })

  it('should render subtitle when provided', () => {
    render(<StatCard title="Users" value={1000} subtitle="Active users" />)
    
    expect(screen.getByText('Active users')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const { container } = render(<StatCard title="Users" value={1000} icon={Users} />)
    
    // Иконка рендерится как SVG, не как img
    const iconElement = container.querySelector('svg')
    expect(iconElement).toBeInTheDocument()
  })

  it('should render with all props', () => {
    render(
      <StatCard
        title="Total Revenue"
        value={50000}
        change={12.5}
        subtitle="This month"
        icon={TrendingUp}
      />
    )
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('50 000')).toBeInTheDocument()
    expect(screen.getByText(/\+12\.5%/i)).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('should not render change when not provided', () => {
    render(<StatCard title="Users" value={1000} />)
    
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    expect(screen.queryByText(/-/)).not.toBeInTheDocument()
  })

  it('should format change with one decimal place', () => {
    render(<StatCard title="Test" value={100} change={15.567} />)
    
    expect(screen.getByText(/\+15\.6%/i)).toBeInTheDocument()
  })

  it('should handle very small positive change', () => {
    render(<StatCard title="Test" value={100} change={0.1} />)
    
    expect(screen.getByText(/\+0\.1%/i)).toBeInTheDocument()
  })

  it('should handle very small negative change', () => {
    render(<StatCard title="Test" value={100} change={-0.1} />)
    
    expect(screen.getByText(/-0\.1%/i)).toBeInTheDocument()
  })
})
