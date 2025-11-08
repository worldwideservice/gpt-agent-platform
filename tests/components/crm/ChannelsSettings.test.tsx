import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChannelsSettings } from '@/components/crm/ChannelsSettings'

describe('ChannelsSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render channels settings', () => {
    const onAllChannelsToggle = vi.fn()
    const onChannelToggle = vi.fn()
    const onSync = vi.fn().mockResolvedValue(undefined)
    
    render(
      <ChannelsSettings
        channels={[]}
        allChannelsEnabled={false}
        onAllChannelsToggle={onAllChannelsToggle}
        onChannelToggle={onChannelToggle}
        onSync={onSync}
      />
    )
    
    // Компонент должен рендериться (может быть несколько элементов с текстом "Каналы")
    const channelsTexts = screen.getAllByText(/каналы/i)
    expect(channelsTexts.length).toBeGreaterThan(0)
  })

  it('should render channel checkboxes', () => {
    const onAllChannelsToggle = vi.fn()
    const onChannelToggle = vi.fn()
    const onSync = vi.fn().mockResolvedValue(undefined)
    
    render(
      <ChannelsSettings
        channels={[
          { id: '1', name: 'Channel 1', type: 'telegram', isActive: false },
        ]}
        allChannelsEnabled={false}
        onAllChannelsToggle={onAllChannelsToggle}
        onChannelToggle={onChannelToggle}
        onSync={onSync}
      />
    )
    
    // Проверяем что есть переключатели для каналов
    const switches = screen.queryAllByRole('switch')
    expect(switches.length).toBeGreaterThan(0)
  })
})

