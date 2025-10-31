import type { Meta, StoryObj } from '@storybook/react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { NextIntlClientProvider } from 'next-intl'

// Mock messages for Storybook
const mockMessages = {
  common: {
    selectOrganization: 'Select organization',
  },
}

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'UI/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A language switcher component for internationalized applications.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider messages={mockMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LanguageSwitcher>

export const Default: Story = {
  args: {},
}

export const InHeader: Story = {
  render: (args) => (
    <div className="flex items-center gap-4 p-4 bg-white border-b">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Application Header</h1>
      </div>
      <LanguageSwitcher {...args} />
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  ),
}

export const InNavigation: Story = {
  render: (args) => (
    <nav className="flex items-center justify-between p-4 bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded"></div>
        <span className="font-semibold">My App</span>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher {...args} />
        <button className="px-3 py-1 text-sm border rounded">Login</button>
      </div>
    </nav>
  ),
}
