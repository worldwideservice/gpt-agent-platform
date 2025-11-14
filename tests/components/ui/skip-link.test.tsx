import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkipLink } from '@/components/landing/skip-link'

describe('SkipLink Component', () => {
  it('should render skip link', () => {
    render(<SkipLink />)
    
    const link = screen.getByRole('link', { name: /перейти к основному содержимому/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#main-content')
  })
})

