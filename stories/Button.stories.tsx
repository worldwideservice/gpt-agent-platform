import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
 title: 'UI/Button',
 component: Button,
 parameters: {
 layout: 'centered',
 docs: {
 description: {
 component: 'A versatile button component with multiple variants and sizes.',
 },
 },
 },
 tags: ['autodocs'],
 argTypes: {
 variant: {
 control: { type: 'select' },
 options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
 description: 'The visual style of the button',
 },
 size: {
 control: { type: 'select' },
 options: ['default', 'sm', 'lg', 'icon'],
 description: 'The size of the button',
 },
 disabled: {
 control: 'boolean',
 description: 'Whether the button is disabled',
 },
 children: {
 control: 'text',
 description: 'The content of the button',
 },
 onClick: { action: 'clicked' },
 },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
 args: {
 children: 'Button',
 },
}

export const Variants: Story = {
 render: (args) => (
 <div className="flex gap-4 flex-wrap">
 <Button variant="default" {...args}>Default</Button>
 <Button variant="destructive" {...args}>Destructive</Button>
 <Button variant="outline" {...args}>Outline</Button>
 <Button variant="secondary" {...args}>Secondary</Button>
 <Button variant="ghost" {...args}>Ghost</Button>
 <Button variant="link" {...args}>Link</Button>
 </div>
 ),
 args: {
 onClick: () => console.log('Button clicked'),
 },
}

export const Sizes: Story = {
 render: (args) => (
 <div className="flex gap-4 items-center flex-wrap">
 <Button size="sm" {...args}>Small</Button>
 <Button size="default" {...args}>Default</Button>
 <Button size="lg" {...args}>Large</Button>
 <Button size="icon" {...args}>
 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
 </svg>
 </Button>
 </div>
 ),
}

export const States: Story = {
 render: (args) => (
 <div className="flex gap-4 flex-wrap">
 <Button {...args}>Normal</Button>
 <Button disabled {...args}>Disabled</Button>
 <Button loading {...args}>Loading</Button>
 </div>
 ),
}

export const WithIcons: Story = {
 render: (args) => (
 <div className="flex gap-4 flex-wrap">
 <Button {...args}>
 <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
 </svg>
 Add Item
 </Button>
 <Button variant="outline" {...args}>
 Settings
 <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 </Button>
 </div>
 ),
}

export const AsChild: Story = {
 render: (args) => (
 <Button asChild {...args}>
 <a href="#" onClick={(e) => e.preventDefault()}>
 Link styled as button
 </a>
 </Button>
 ),
}
