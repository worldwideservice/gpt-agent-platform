import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggles between light and dark mode. Saves preference to localStorage.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const InHeader: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <span className="text-sm">Theme:</span>
      <ThemeToggle />
    </div>
  ),
}

