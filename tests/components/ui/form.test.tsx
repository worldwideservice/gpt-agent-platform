import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Мокаем react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
  })),
  Controller: ({ render }: any) => render({ field: {}, fieldState: {} }),
  FormProvider: ({ children }: any) => <form>{children}</form>,
  useFormContext: () => ({
    control: {},
    formState: { errors: {} },
    getFieldState: vi.fn(() => ({ error: undefined, invalid: false, isDirty: false, isTouched: false })),
  }),
  useFormState: () => ({ errors: {} }),
}))

describe('Form Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form', () => {
    render(
      <Form>
        <form>
          <div>Form content</div>
        </form>
      </Form>
    )
    
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })

  it('should render form field', () => {
    render(
      <Form>
        <FormField
          name="test"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Label</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Test description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    )
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
})

