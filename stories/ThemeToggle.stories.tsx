import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ThemeProvider } from '@/contexts/ThemeContext'

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle component that switches between light, dark, and system themes.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system">
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {
  args: {},
}

export const InHeader: Story = {
  render: (args) => (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">My App</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle {...(args as any)} />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </header>
  ),
}

export const Standalone: Story = {
  render: (args) => (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Theme Settings
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
            <ThemeToggle {...(args as any)} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Choose your preferred theme or follow system settings
          </p>
        </div>
      </div>
    </div>
  ),
}

export const WithLabels: Story = {
  render: (args) => (
    <div className="flex items-center gap-4 p-4">
      <span className="text-sm font-medium">Theme:</span>
      <ThemeToggle {...(args as any)} />
      <span className="text-sm text-gray-600">
        {typeof window !== 'undefined' &&
          (localStorage.getItem('theme') || 'system')}
      </span>
    </div>
  ),
}
