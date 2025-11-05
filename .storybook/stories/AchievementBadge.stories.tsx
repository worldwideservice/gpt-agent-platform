import type { Meta, StoryObj } from '@storybook/react'
import { AchievementBadge } from '@/components/ui/achievement-badge'

const meta = {
  title: 'UI/AchievementBadge',
  component: AchievementBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Gamification element for showing user achievements with progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Achievement title',
    },
    description: {
      control: 'text',
      description: 'Achievement description',
    },
    icon: {
      control: 'select',
      options: ['check', 'award', 'star', 'trophy'],
      description: 'Icon type',
    },
    unlocked: {
      control: 'boolean',
      description: 'Whether achievement is unlocked',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Progress percentage (0-100)',
    },
  },
} satisfies Meta<typeof AchievementBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Unlocked: Story = {
  args: {
    title: 'First Agent Created',
    description: 'You created your first AI agent',
    icon: 'trophy',
    unlocked: true,
    progress: 100,
  },
}

export const LockedWithProgress: Story = {
  args: {
    title: '10 Agents Created',
    description: 'Create 10 AI agents to unlock this achievement',
    icon: 'star',
    unlocked: false,
    progress: 60,
  },
}

export const LockedNoProgress: Story = {
  args: {
    title: 'Master Automator',
    description: 'Create 100 automation sequences',
    icon: 'award',
    unlocked: false,
    progress: 0,
  },
}

export const AlmostComplete: Story = {
  args: {
    title: 'Knowledge Base Expert',
    description: 'Add 50 items to knowledge base',
    icon: 'check',
    unlocked: false,
    progress: 95,
  },
}

export const AllAchievements: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <AchievementBadge
        title="First Agent Created"
        description="You created your first AI agent"
        icon="trophy"
        unlocked={true}
      />
      <AchievementBadge
        title="10 Agents Created"
        description="Create 10 AI agents"
        icon="star"
        unlocked={false}
        progress={70}
      />
      <AchievementBadge
        title="Master Automator"
        description="Create 100 automation sequences"
        icon="award"
        unlocked={false}
        progress={45}
      />
    </div>
  ),
}

