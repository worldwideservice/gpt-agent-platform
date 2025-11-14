import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedCounter } from '@/components/landing/animated-counter'

const meta = {
  title: 'UI/AnimatedCounter',
  component: AnimatedCounter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animates number from 0 to target value when visible in viewport.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Target value to animate to',
    },
    duration: {
      control: 'number',
      description: 'Animation duration in milliseconds',
    },
    suffix: {
      control: 'text',
      description: 'Text to append after number',
    },
    prefix: {
      control: 'text',
      description: 'Text to prepend before number',
    },
    decimals: {
      control: 'number',
      description: 'Number of decimal places',
    },
  },
} satisfies Meta<typeof AnimatedCounter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 100,
    suffix: '+',
    duration: 2000,
    className: 'text-4xl font-bold text-[#E63946]',
  },
}

export const WithPrefix: Story = {
  args: {
    value: 1500,
    prefix: '$',
    duration: 2000,
    className: 'text-4xl font-bold text-green-600',
  },
}

export const WithDecimals: Story = {
  args: {
    value: 99.9,
    suffix: '%',
    decimals: 1,
    duration: 2000,
    className: 'text-4xl font-bold text-blue-600',
  },
}

export const FastAnimation: Story = {
  args: {
    value: 1000,
    duration: 500,
    className: 'text-4xl font-bold text-purple-600',
  },
}

export const SlowAnimation: Story = {
  args: {
    value: 500,
    duration: 5000,
    className: 'text-4xl font-bold text-orange-600',
  },
}

