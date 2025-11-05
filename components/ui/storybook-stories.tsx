/**
 * Storybook Stories Template
 * 
 * This file contains templates for creating Storybook stories
 * for all new design components.
 * 
 * To use:
 * 1. Copy the template for each component
 * 2. Create separate .stories.tsx files
 * 3. Import into Storybook
 */

// Example template for ScrollAnimation
export const ScrollAnimationTemplate = `
import type { Meta, StoryObj } from '@storybook/react'
import { ScrollAnimation } from '@/components/ui/scroll-animation'

const meta = {
  title: 'UI/ScrollAnimation',
  component: ScrollAnimation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollAnimation>

export default meta
type Story = StoryObj<typeof meta>

export const FadeIn: Story = {
  args: {
    direction: 'fade',
    delay: 0,
    duration: 600,
    children: <div className="p-8 bg-gray-100 rounded">Content fades in</div>,
  },
}

export const SlideUp: Story = {
  args: {
    direction: 'up',
    delay: 100,
    duration: 600,
    children: <div className="p-8 bg-blue-100 rounded">Content slides up</div>,
  },
}
`

// Example template for AnimatedCounter
export const AnimatedCounterTemplate = `
import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const meta = {
  title: 'UI/AnimatedCounter',
  component: AnimatedCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatedCounter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 100,
    suffix: '+',
    duration: 2000,
  },
}

export const WithPrefix: Story = {
  args: {
    value: 1500,
    prefix: '$',
    duration: 2000,
  },
}
`

// Example template for ThemeToggle
export const ThemeToggleTemplate = `
import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
`

// Example template for GlassCard
export const GlassCardTemplate = `
import type { Meta, StoryObj } from '@storybook/react'
import { GlassCard, CardHeader, CardTitle, CardDescription } from '@/components/ui/glass-card'

const meta = {
  title: 'UI/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GlassCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>Modern glassmorphism effect</CardDescription>
        </CardHeader>
      </>
    ),
  },
}

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: (
      <>
        <CardHeader>
          <CardTitle>Subtle Glass</CardTitle>
          <CardDescription>More transparent effect</CardDescription>
        </CardHeader>
      </>
    ),
  },
}
`

/**
 * Instructions:
 * 
 * 1. Create files in .storybook/stories/:
 *    - ScrollAnimation.stories.tsx
 *    - AnimatedCounter.stories.tsx
 *    - ThemeToggle.stories.tsx
 *    - GlassCard.stories.tsx
 *    - ProgressRing.stories.tsx
 *    - AchievementBadge.stories.tsx
 * 
 * 2. Use templates above as starting point
 * 
 * 3. Run Storybook:
 *    npm run storybook
 * 
 * 4. View stories at:
 *    http://localhost:6006
 */

