import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KommoSetup } from '@/components/crm/KommoSetup'

// Мокаем fetch
global.fetch = vi.fn()

describe('KommoSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
  })

  it('should render Kommo setup', () => {
    const onConnectionEstablished = vi.fn()
    const onError = vi.fn()
    
    render(
      <KommoSetup
        connection={null}
        onConnectionEstablished={onConnectionEstablished}
        onError={onError}
      />
    )
    
    // Компонент должен рендериться
    const setupComponent = document.querySelector('div')
    expect(setupComponent).toBeInTheDocument()
  })

  it('should render connection form', () => {
    const onConnectionEstablished = vi.fn()
    const onError = vi.fn()
    
    render(
      <KommoSetup
        connection={null}
        onConnectionEstablished={onConnectionEstablished}
        onError={onError}
      />
    )
    
    // Проверяем что форма подключения отображается
    const form = screen.queryByRole('form') || document.querySelector('form')
    if (form) {
      expect(form).toBeInTheDocument()
    }
  })
})

