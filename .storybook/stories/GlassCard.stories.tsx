import type { Meta, StoryObj } from '@storybook/react'
import { GlassCard, CardHeader, CardTitle, CardDescription } from '@/components/ui/glass-card'

const meta = {
  title: 'UI/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern glassmorphism card with backdrop blur and transparency effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'strong'],
      description: 'Glass effect intensity',
    },
  },
} satisfies Meta<typeof GlassCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <CardHeader>
        <CardTitle>Glass Card</CardTitle>
        <CardDescription>
          Modern glassmorphism effect with backdrop blur
        </CardDescription>
      </CardHeader>
    ),
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: (
      <CardHeader>
        <CardTitle>Subtle Glass</CardTitle>
        <CardDescription>
          More transparent glass effect
        </CardDescription>
      </CardHeader>
    ),
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
}

export const Strong: Story = {
  args: {
    variant: 'strong',
    children: (
      <CardHeader>
        <CardTitle>Strong Glass</CardTitle>
        <CardDescription>
          More opaque glass effect with stronger blur
        </CardDescription>
      </CardHeader>
    ),
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <Story />
      </div>
    ),
  ],
}

