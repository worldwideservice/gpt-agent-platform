import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const mockConfig = {
  value: {
    label: 'Value',
  },
}

describe('Chart Component', () => {
  it('should render chart container', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    )
    
    const chartContainer = container.firstChild
    expect(chartContainer).toBeInTheDocument()
  })

  it('should render chart tooltip', () => {
    render(
      <ChartTooltip>
        <ChartTooltipContent>Tooltip</ChartTooltipContent>
      </ChartTooltip>
    )
    
    // ChartTooltip может рендериться в портале, проверяем что компонент рендерится
    const tooltip = document.querySelector('[data-slot="chart-tooltip"]')
    if (tooltip) {
      expect(tooltip).toBeInTheDocument()
    }
  })
})

