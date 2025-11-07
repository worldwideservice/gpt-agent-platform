import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KnowledgeBaseSettings } from '@/components/crm/KnowledgeBaseSettings'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  BookOpen: () => <div data-testid="book-icon">BookOpen</div>,
  ExternalLink: () => <div data-testid="external-link-icon">ExternalLink</div>,
}))

// Mock UI components
vi.mock('@/components/ui', async () => {
  const actual = await vi.importActual('@/components/ui')
  return {
    ...actual,
    Button: ({ children, onClick, disabled, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
  }
})

vi.mock('@/components/ui/shadcn/textarea', () => ({
  Textarea: ({ value, onChange, placeholder, ...props }: any) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="textarea-input"
      {...props}
    />
  ),
}))

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, disabled, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      data-testid="switch-input"
      {...props}
    />
  ),
}))

describe('KnowledgeBaseSettings Component', () => {
  const mockProps = {
    allCategoriesEnabled: false,
    createTaskOnNotFound: false,
    notFoundMessage: 'Not found',
    onAllCategoriesToggle: vi.fn(),
    onCreateTaskToggle: vi.fn(),
    onMessageChange: vi.fn(),
    onOpenKnowledgeBase: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render component', () => {
    render(<KnowledgeBaseSettings {...mockProps} />)
    expect(screen.getByText(/база знаний/i)).toBeInTheDocument()
  })

  it('should display all categories toggle', () => {
    render(<KnowledgeBaseSettings {...mockProps} />)
    expect(screen.getByText(/разрешить доступ ко всем категориям/i)).toBeInTheDocument()
  })

  it('should call onAllCategoriesToggle when switch is clicked', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBaseSettings {...mockProps} />)

    const switches = screen.getAllByTestId('switch-input')
    if (switches[0]) {
      await user.click(switches[0])
      expect(mockProps.onAllCategoriesToggle).toHaveBeenCalled()
    }
  })

  it('should call onCreateTaskToggle when create task switch is clicked', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBaseSettings {...mockProps} />)

    const switches = screen.getAllByTestId('switch-input')
    if (switches[1]) {
      await user.click(switches[1])
      expect(mockProps.onCreateTaskToggle).toHaveBeenCalled()
    }
  })

  it('should call onMessageChange when textarea value changes', async () => {
    const user = userEvent.setup()
    const propsWithTaskEnabled = { ...mockProps, createTaskOnNotFound: true }
    render(<KnowledgeBaseSettings {...propsWithTaskEnabled} />)

    const textarea = screen.getByTestId('textarea-input')
    await user.clear(textarea)
    await user.type(textarea, 'New message')
    expect(mockProps.onMessageChange).toHaveBeenCalled()
  })

  it('should call onOpenKnowledgeBase when button is clicked', async () => {
    const user = userEvent.setup()
    render(<KnowledgeBaseSettings {...mockProps} />)

    const button = screen.getByRole('button', { name: /открыть базу знаний/i })
    await user.click(button)
    expect(mockProps.onOpenKnowledgeBase).toHaveBeenCalled()
  })

  it('should disable controls when disabled prop is true', () => {
    render(<KnowledgeBaseSettings {...mockProps} disabled={true} />)

    const switches = screen.getAllByTestId('switch-input')
    switches.forEach((switchEl) => {
      expect(switchEl).toBeDisabled()
    })
  })
})

