import type { Meta, StoryObj } from '@storybook/react'
import { ProgressRing } from '@/components/landing/progress-ring'

const meta = {
  title: 'UI/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Circular progress indicator with smooth animation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    size: {
      control: 'number',
      description: 'Size in pixels',
    },
    strokeWidth: {
      control: 'number',
      description: 'Stroke width in pixels',
    },
    color: {
      control: 'color',
      description: 'Progress color',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show percentage label',
    },
  },
} satisfies Meta<typeof ProgressRing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 75,
    size: 100,
    strokeWidth: 8,
    color: '#E63946',
    showLabel: true,
  },
}

export const Small: Story = {
  args: {
    value: 50,
    size: 60,
    strokeWidth: 6,
    color: '#3b82f6',
    showLabel: true,
  },
}

export const Large: Story = {
  args: {
    value: 90,
    size: 150,
    strokeWidth: 12,
    color: '#10b981',
    showLabel: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    value: 65,
    size: 100,
    strokeWidth: 8,
    color: '#8b5cf6',
    showLabel: false,
  },
}

export const Complete: Story = {
  args: {
    value: 100,
    size: 100,
    strokeWidth: 8,
    color: '#10b981',
    showLabel: true,
  },
}

export const LowProgress: Story = {
  args: {
    value: 25,
    size: 100,
    strokeWidth: 8,
    color: '#ef4444',
    showLabel: true,
  },
}

