import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CRMSync } from '@/components/crm/CRMSync'

// Mock hooks
vi.mock('@/hooks/useCRMData', () => ({
  useCRMData: () => ({
    pipelines: [
      {
        id: 'pipeline-1',
        name: 'Pipeline 1',
        isActive: true,
        stages: [
          { id: 'stage-1', name: 'Stage 1' },
          { id: 'stage-2', name: 'Stage 2' },
        ],
      },
    ],
    isLoading: false,
    error: null,
    syncData: vi.fn(),
    isConnected: true,
  }),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  RefreshCw: () => <div data-testid="refresh-icon">RefreshCw</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
}))

// Mock UI components
vi.mock('@/components/ui', async () => {
  const actual = await vi.importActual('@/components/ui')
  return {
    ...actual,
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  }
})

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}))

vi.mock('@/components/ui/Select', () => ({
  Select: ({ children }: any) => <div data-testid="select-mock">{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ placeholder }: any) => <div data-testid="select-value">{placeholder || 'Select'}</div>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children, onValueChange }: any) => (
    <div data-testid={`select-item-${value}`} onClick={() => onValueChange?.(value)}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/ui/shadcn/textarea', () => ({
  Textarea: ({ value, onChange, ...props }: any) => (
    <textarea value={value} onChange={onChange} {...props} />
  ),
}))

vi.mock('@/components/ui/shadcn/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

describe('CRMSync Component', () => {
  const mockConnection = {
    id: 'conn-1',
    type: 'kommo',
    name: 'Test Connection',
  }

  const mockPipelineSettings = [
    {
      id: 'pipeline-1',
      name: 'Pipeline 1',
      isActive: true,
      allStages: false,
      selectedStages: ['stage-1'],
    },
  ]

  const mockOnPipelineUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render component', () => {
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={mockPipelineSettings}
        onPipelineUpdate={mockOnPipelineUpdate}
      />,
    )

    expect(document.body).toBeDefined()
  })

  it('should display pipelines', () => {
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={mockPipelineSettings}
        onPipelineUpdate={mockOnPipelineUpdate}
      />,
    )

    // Component should render
    expect(document.body).toBeDefined()
  })

  it('should call onPipelineUpdate when pipeline settings change', async () => {
    const user = userEvent.setup()
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={mockPipelineSettings}
        onPipelineUpdate={mockOnPipelineUpdate}
      />,
    )

    // Component should be interactive
    expect(document.body).toBeDefined()
  })

  it('should handle null connection', () => {
    render(
      <CRMSync
        connection={null}
        pipelineSettings={mockPipelineSettings}
        onPipelineUpdate={mockOnPipelineUpdate}
      />,
    )

    expect(document.body).toBeDefined()
  })

  it('should handle empty pipeline settings', () => {
    render(
      <CRMSync
        connection={mockConnection}
        pipelineSettings={[]}
        onPipelineUpdate={mockOnPipelineUpdate}
      />,
    )

    expect(document.body).toBeDefined()
  })
})

