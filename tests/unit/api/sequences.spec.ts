import { describe, expect, it } from 'vitest'
import { createSequenceSchema } from '@/app/api/agents/[id]/sequences/route'
import { createStepSchema, updateSchema as updateStepSchema } from '@/app/api/agents/[id]/sequences/[sequenceId]/steps/route'

describe('Sequences API schemas', () => {
  it('allows creating sequence with steps', () => {
    const parsed = createSequenceSchema.parse({
      name: 'Follow-up',
      steps: [
        {
          channel: 'email',
          wait_interval: '1 day',
          template: 'Hello',
        },
      ],
    })

    expect(parsed).toHaveProperty('name', 'Follow-up')
    expect(parsed.steps).toHaveLength(1)
  })

  it('rejects sequence without steps', () => {
    expect(() =>
      createSequenceSchema.parse({
        name: 'Invalid',
        steps: [],
      }),
    ).toThrow()
  })

  it('validates step payload', () => {
    expect(() =>
      createStepSchema.parse({
        channel: '',
        wait_interval: '5 min',
        template: 'Step',
      }),
    ).toThrow()
  })

  it('allows updating step with optional fields', () => {
    const parsed = updateStepSchema.parse({
      template: 'Updated text',
    })

    expect(parsed).toEqual({ template: 'Updated text' })
  })
})
