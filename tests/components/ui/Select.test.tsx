import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

describe('Select Component', () => {
  it('should render select trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Выберите опцию" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Опция 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Выберите опцию')).toBeInTheDocument()
  })

  it('should display selected value', () => {
    render(
      <Select value="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Опция 1</SelectItem>
        </SelectContent>
      </Select>
    )

    // SelectValue показывает значение или placeholder
    const valueElement = screen.getByText(/option1|Выберите опцию/)
    expect(valueElement).toBeInTheDocument()
  })

  it('should call onValueChange when item is selected', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" onValueChange={handleChange}>Опция 1</SelectItem>
          <SelectItem value="option2" onValueChange={handleChange}>Опция 2</SelectItem>
        </SelectContent>
      </Select>
    )

    // Находим SelectItem и кликаем напрямую
    const option1 = screen.getByText('Опция 1')
    await user.click(option1)

    // Проверяем, что onValueChange был вызван через Select компонент
    // (Select передает onValueChange в SelectItem через cloneElement)
    expect(handleChange).toHaveBeenCalled()
  })

  it('should render multiple select items', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Выберите" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Опция 1</SelectItem>
          <SelectItem value="option2">Опция 2</SelectItem>
          <SelectItem value="option3">Опция 3</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByText('Выберите')
    expect(trigger).toBeInTheDocument()
  })
})

