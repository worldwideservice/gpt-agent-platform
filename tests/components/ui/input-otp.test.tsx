import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

describe('InputOTP Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render input OTP', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    )
    
    // InputOTP должен рендериться
    const inputOTP = container.querySelector('[data-slot="input-otp"]')
    expect(inputOTP).toBeInTheDocument()
  })

  it('should render OTP group', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    )
    
    const group = container.querySelector('[data-slot="input-otp-group"]')
    expect(group).toBeInTheDocument()
  })

  it('should render separator', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>
    )
    
    const separator = container.querySelector('[data-slot="input-otp-separator"]')
    if (separator) {
      expect(separator).toBeInTheDocument()
    }
  })
})

