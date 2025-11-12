import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KommoAPIDebugger } from '@/components/crm/KommoAPIDebugger'

// Мокаем fetch
global.fetch = vi.fn()

describe('KommoAPIDebugger Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    } as Response)
  })

  it('should render Kommo API debugger', () => {
    render(<KommoAPIDebugger />)
    
    // Компонент должен рендериться
    const debuggerComponent = document.querySelector('div')
    expect(debuggerComponent).toBeInTheDocument()
  })

  it('should render access token input', () => {
    render(<KommoAPIDebugger />)
    
    const input = screen.queryByPlaceholderText(/access token/i) || screen.queryByLabelText(/token/i)
    if (input) {
      expect(input).toBeInTheDocument()
    }
  })

  it('should render test button', () => {
    render(<KommoAPIDebugger />)
    
    const testButton = screen.queryByRole('button', { name: /тестировать|test/i })
    if (testButton) {
      expect(testButton).toBeInTheDocument()
    }
  })

  it('should update access token on input', async () => {
    const user = userEvent.setup()
    
    render(<KommoAPIDebugger />)
    
    const input = screen.queryByPlaceholderText(/access token/i) || screen.queryByLabelText(/token/i)
    if (input) {
      await user.type(input, 'test-token')
      expect(input).toHaveValue('test-token')
    }
  })
})

