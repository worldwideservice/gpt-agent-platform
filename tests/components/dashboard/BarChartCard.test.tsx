import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BarChartCard } from '@/components/dashboard/BarChartCard'

const mockData = [
  { label: 'Agent 1', value: 100 },
  { label: 'Agent 2', value: 150 },
  { label: 'Agent 3', value: 200 },
]

describe('BarChartCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render bar chart card with title', () => {
    render(<BarChartCard title="Agent Activity" data={mockData} />)
    
    expect(screen.getByText('Agent Activity')).toBeInTheDocument()
  })

  it('should render subtitle when provided', () => {
    render(<BarChartCard title="Chart" subtitle="Last 30 days" data={mockData} />)
    
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('should render bars when data is provided', () => {
    render(<BarChartCard title="Chart" data={mockData} />)
    
    // Проверяем наличие меток данных
    expect(screen.getByText('Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Agent 2')).toBeInTheDocument()
    expect(screen.getByText('Agent 3')).toBeInTheDocument()
  })

  it('should format values correctly', () => {
    render(<BarChartCard title="Chart" data={mockData} />)
    
    // Проверяем форматирование чисел
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<BarChartCard title="Chart" data={[]} emptyMessage="No data available" />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should render default empty message when no data and no custom message', () => {
    render(<BarChartCard title="Chart" data={[]} />)
    
    expect(screen.getByText('Недостаточно данных для отображения')).toBeInTheDocument()
  })

  it('should render empty state when all values are zero', () => {
    const zeroData = [
      { label: 'Agent 1', value: 0 },
      { label: 'Agent 2', value: 0 },
    ]
    
    render(<BarChartCard title="Chart" data={zeroData} emptyMessage="No activity" />)
    
    expect(screen.getByText('No activity')).toBeInTheDocument()
  })
})

