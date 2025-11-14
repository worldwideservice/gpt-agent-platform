import type { Meta, StoryObj } from '@storybook/react'
import { ScrollAnimation } from '@/components/landing/scroll-animation'

const meta = {
  title: 'UI/ScrollAnimation',
  component: ScrollAnimation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animates children when they enter the viewport using Intersection Observer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'down', 'left', 'right', 'fade'],
      description: 'Animation direction',
    },
    delay: {
      control: 'number',
      description: 'Delay in milliseconds before animation starts',
    },
    duration: {
      control: 'number',
      description: 'Animation duration in milliseconds',
    },
    threshold: {
      control: 'number',
      description: 'Intersection Observer threshold (0-1)',
    },
  },
} satisfies Meta<typeof ScrollAnimation>

export default meta
type Story = StoryObj<typeof meta>

export const FadeIn: Story = {
  args: {
    direction: 'fade',
    delay: 0,
    duration: 600,
    children: (
      <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Fade In Animation</h3>
        <p>This content fades in when it enters the viewport.</p>
      </div>
    ),
  },
}

export const SlideUp: Story = {
  args: {
    direction: 'up',
    delay: 100,
    duration: 600,
    children: (
      <div className="p-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Slide Up Animation</h3>
        <p>This content slides up when it enters the viewport.</p>
      </div>
    ),
  },
}

export const SlideLeft: Story = {
  args: {
    direction: 'left',
    delay: 200,
    duration: 600,
    children: (
      <div className="p-8 bg-green-100 dark:bg-green-900 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Slide Left Animation</h3>
        <p>This content slides from right to left.</p>
      </div>
    ),
  },
}

export const WithDelay: Story = {
  args: {
    direction: 'up',
    delay: 500,
    duration: 800,
    children: (
      <div className="p-8 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Delayed Animation</h3>
        <p>This animation starts after 500ms delay.</p>
      </div>
    ),
  },
}

