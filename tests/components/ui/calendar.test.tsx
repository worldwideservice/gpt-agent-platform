import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Calendar } from '@/components/ui/calendar'

describe('Calendar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render calendar', () => {
    const { container } = render(<Calendar />)
    
    // Calendar должен рендериться
    const calendar = container.querySelector('table') || container.querySelector('[role="grid"]')
    expect(calendar).toBeInTheDocument()
  })

  it('should render with selected date', () => {
    const date = new Date(2024, 0, 15)
    const { container } = render(<Calendar selected={date} />)
    
    const calendar = container.querySelector('table') || container.querySelector('[role="grid"]')
    expect(calendar).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Calendar className="custom-class" />)
    
    // Calendar рендерится через DayPicker, className применяется к корневому элементу
    const calendar = container.firstChild
    if (calendar) {
      expect(calendar).toHaveClass('custom-class')
    }
  })
})

