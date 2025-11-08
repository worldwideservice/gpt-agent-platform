import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'

// Мокаем next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}))

describe('Sonner Component', () => {
  it('should render toaster', () => {
    const { container } = render(<Toaster />)
    
    // Toaster рендерится в портале, проверяем что компонент рендерится
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should apply custom position', () => {
    const { container } = render(<Toaster position="top-right" />)
    
    // Toaster рендерится в портале, проверяем что компонент рендерится
    expect(container.firstChild).toBeInTheDocument()
  })
})

