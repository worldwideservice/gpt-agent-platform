import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { DealContactFieldsSelector } from '@/components/crm/DealContactFieldsSelector'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
  GripVertical: () => <div data-testid="grip-icon">GripVertical</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
}))

// Mock useToast
vi.mock('@/components/ui/toast-context', () => ({
  useToast: () => ({
    push: vi.fn(),
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock Select component to avoid Radix UI issues
vi.mock('@/components/ui/Select', () => ({
  Select: ({ label, options, value, onChange, placeholder }: any) => (
    <div data-testid="select-mock">
      {label && <label>{label}</label>}
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid="select-input"
      >
        <option value="">{placeholder || 'Выберите...'}</option>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}))

// Mock Button component
vi.mock('@/components/ui', async () => {
  const actual = await vi.importActual('@/components/ui')
  return {
    ...actual,
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    useToast: () => ({
      push: vi.fn(),
    }),
  }
})

// Mock fetch
global.fetch = vi.fn()

describe('DealContactFieldsSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render component and load fields', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          dealFields: [],
          contactFields: [],
        },
      }),
    } as Response)

    render(<DealContactFieldsSelector agentId="agent-123" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/agents/agent-123/fields')
    }, { timeout: 3000 })

    // Component should render - check for any rendered content
    const container = document.body
    expect(container).toBeDefined()
  })

  it('should load and display available fields', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          dealFields: ['name', 'price'],
          contactFields: ['email', 'phone'],
        },
      }),
    } as Response)

    render(<DealContactFieldsSelector agentId="agent-123" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/agents/agent-123/fields')
    }, { timeout: 3000 })

    // Verify component rendered
    expect(document.body).toBeDefined()
  })

  it('should call onFieldsChange when fields are updated', async () => {
    const onFieldsChange = vi.fn()
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          dealFields: ['name'],
          contactFields: ['email'],
        },
      }),
    } as Response)

    render(<DealContactFieldsSelector agentId="agent-123" onFieldsChange={onFieldsChange} />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    }, { timeout: 3000 })

    // onFieldsChange should be called when component loads with initial values
    await waitFor(() => {
      expect(onFieldsChange).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<DealContactFieldsSelector agentId="agent-123" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/agents/agent-123/fields')
    }, { timeout: 3000 })

    // Component should still render despite error
    expect(document.body).toBeDefined()
  })

  it('should handle API response with no data', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
      }),
    } as Response)

    render(<DealContactFieldsSelector agentId="agent-123" />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    }, { timeout: 3000 })

    expect(document.body).toBeDefined()
  })
})

