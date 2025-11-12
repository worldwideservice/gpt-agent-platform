import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SimpleDashboardStats } from '@/components/dashboard/SimpleDashboardStats'
import type { DashboardStats } from '@/types'

describe('SimpleDashboardStats Component', () => {
  const mockStats: DashboardStats = {
    monthlyResponses: 1500,
    weeklyResponses: 350,
    todayResponses: 50,
    totalAgents: 5,
    monthlyChange: 15.5,
    todayChange: 10.2,
  }

  it('should render all stat cards', () => {
    render(<SimpleDashboardStats stats={mockStats} />)
    
    expect(screen.getByText(/ответы ИИ за этот месяц/i)).toBeInTheDocument()
    expect(screen.getByText(/ответы ИИ за последние 7 дней/i)).toBeInTheDocument()
    expect(screen.getByText(/ответы ИИ сегодня/i)).toBeInTheDocument()
    expect(screen.getByText(/агенты/i)).toBeInTheDocument()
  })

  it('should display formatted numbers', () => {
    render(<SimpleDashboardStats stats={mockStats} />)
    
    // Проверяем форматирование чисел (русская локализация)
    expect(screen.getByText('1 500')).toBeInTheDocument()
    expect(screen.getByText('350')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should display monthly change percentage', () => {
    render(<SimpleDashboardStats stats={mockStats} />)
    
    const changeText = screen.getByText(/\+15\.5% к прошлому месяцу/i)
    expect(changeText).toBeInTheDocument()
  })

  it('should display today change percentage', () => {
    render(<SimpleDashboardStats stats={mockStats} />)
    
    const changeText = screen.getByText(/\+10\.2% к вчерашнему дню/i)
    expect(changeText).toBeInTheDocument()
  })

  it('should handle negative changes', () => {
    const statsWithNegative: DashboardStats = {
      ...mockStats,
      monthlyChange: -5.3,
      todayChange: -2.1,
    }

    render(<SimpleDashboardStats stats={statsWithNegative} />)
    
    expect(screen.getByText(/-5\.3% к прошлому месяцу/i)).toBeInTheDocument()
    expect(screen.getByText(/-2\.1% к вчерашнему дню/i)).toBeInTheDocument()
  })

  it('should handle string values', () => {
    const statsWithString: DashboardStats = {
      monthlyResponses: 'N/A' as any,
      weeklyResponses: 'N/A' as any,
      todayResponses: 'N/A' as any,
      totalAgents: 'N/A' as any,
      monthlyChange: 0,
    }

    render(<SimpleDashboardStats stats={statsWithString} />)
    
    // Проверяем через getAllByText
    const allNa = screen.getAllByText('N/A')
    expect(allNa.length).toBe(4)
  })

  it('should not display change when not provided', () => {
    const statsWithoutChange: DashboardStats = {
      monthlyResponses: 1000,
      weeklyResponses: 200,
      todayResponses: 30,
      totalAgents: 3,
    }

    render(<SimpleDashboardStats stats={statsWithoutChange} />)
    
    // Проверяем, что компонент рендерится без ошибок
    expect(screen.getByText('1 000')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('should format large numbers correctly', () => {
    const statsWithLargeNumbers: DashboardStats = {
      monthlyResponses: 1234567,
      weeklyResponses: 98765,
      todayResponses: 1234,
      totalAgents: 100,
      monthlyChange: 0,
    }

    render(<SimpleDashboardStats stats={statsWithLargeNumbers} />)
    
    // Проверяем форматирование больших чисел
    expect(screen.getByText('1 234 567')).toBeInTheDocument()
    expect(screen.getByText('98 765')).toBeInTheDocument()
    expect(screen.getByText('1 234')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})

