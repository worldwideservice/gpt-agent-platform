import type { Meta, StoryObj } from '@storybook/react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

const meta: Meta<typeof OptimizedImage> = {
  title: 'UI/OptimizedImage',
  component: OptimizedImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An optimized image component with lazy loading, error handling, and multiple format support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'The source URL of the image',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    width: {
      control: 'number',
      description: 'Width of the image',
    },
    height: {
      control: 'number',
      description: 'Height of the image',
    },
    fill: {
      control: 'boolean',
      description: 'Whether the image should fill its container',
    },
    priority: {
      control: 'boolean',
      description: 'Whether to prioritize loading this image',
    },
    quality: {
      control: 'number',
      description: 'Quality of the optimized image (1-100)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof OptimizedImage>

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Mountain landscape',
    width: 400,
    height: 300,
  },
}

export const Fill: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    alt: 'Forest landscape',
    fill: true,
    className: 'w-96 h-64',
  },
  decorators: [
    (Story) => (
      <div className="w-96 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
}

export const DifferentQualities: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Low Quality (50)</h3>
        <OptimizedImage {...args} quality={50} />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium Quality (75)</h3>
        <OptimizedImage {...args} quality={75} />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">High Quality (100)</h3>
        <OptimizedImage {...args} quality={100} />
      </div>
    </div>
  ),
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain landscape comparison',
    width: 300,
    height: 200,
  },
}

export const WithError: Story = {
  args: {
    src: 'https://invalid-image-url.com/nonexistent.jpg',
    alt: 'This image will fail to load',
    width: 400,
    height: 300,
  },
}

export const PriorityLoading: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    alt: 'Above the fold image with priority loading',
    width: 400,
    height: 300,
    priority: true,
  },
}

export const ResponsiveSizes: Story = {
  render: (args) => (
    <div className="max-w-md">
      <OptimizedImage
        {...args}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  ),
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Responsive mountain landscape',
    fill: true,
    className: 'w-full h-64 object-cover rounded-lg',
  },
}

export const LoadingStates: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Normal Loading</h3>
        <OptimizedImage {...args} />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Lazy Loading</h3>
        <OptimizedImage {...args} loading="lazy" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Eager Loading</h3>
        <OptimizedImage {...args} loading="eager" />
      </div>
    </div>
  ),
  args: {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    alt: 'Loading comparison',
    width: 300,
    height: 200,
  },
}
