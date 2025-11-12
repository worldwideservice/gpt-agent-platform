import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AgentRules } from '@/components/features/agents/AgentRules'

const mockFetch = vi
  .fn()
  .mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data: [] }),
  })

vi.stubGlobal('fetch', mockFetch)

describe('AgentRules component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders rule list and allows adding a condition', async () => {
    render(<AgentRules agentId="agent-1" />)

    await screen.findByText('Правила ещё не созданы.')

    await userEvent.click(screen.getByRole('button', { name: /Добавить условие/i }))

    expect(screen.getAllByText(/source equals/)).toHaveLength(2)
  })

  it('supports adding an action and shows it in the preview list', async () => {
    render(<AgentRules agentId="agent-1" />)

    await screen.findByText('Правила ещё не созданы.')

    await userEvent.selectOptions(screen.getByTestId('rule-action-type'), 'change_stage')
    await userEvent.type(screen.getByPlaceholderText('ID этапа'), '142')
    await userEvent.click(screen.getByRole('button', { name: /Добавить действие/i }))

    expect(screen.getByText(/change_stage/)).toBeInTheDocument()
    expect(screen.getByText(/142/)).toBeInTheDocument()
  })
})
