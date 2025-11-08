import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AchievementBadge } from '@/components/ui/achievement-badge'

describe('AchievementBadge Component', () => {
  it('should render achievement badge', () => {
    render(<AchievementBadge title="Achievement" description="Description" />)
    
    expect(screen.getByText('Achievement')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should render with icon', () => {
    render(<AchievementBadge title="Achievement" icon="star" />)
    
    expect(screen.getByText('Achievement')).toBeInTheDocument()
  })

  it('should render unlocked badge', () => {
    render(<AchievementBadge title="Achievement" unlocked={true} />)
    
    expect(screen.getByText('Achievement')).toBeInTheDocument()
  })

  it('should render with progress', () => {
    render(<AchievementBadge title="Achievement" progress={50} />)
    
    expect(screen.getByText('Achievement')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <AchievementBadge title="Achievement" className="custom-class" />
    )
    
    const badge = container.firstChild
    if (badge) {
      expect(badge).toHaveClass('custom-class')
    }
  })
})

