import { describe, expect, it } from 'vitest'
import { createRuleSchema, updateRuleSchema } from '@/app/api/agents/[id]/rules/route'

describe('Rule API schemas', () => {
  it('accepts valid rule payload', () => {
    const parsed = createRuleSchema.parse({
      name: 'Test rule',
      trigger_type: 'message_received',
      conditions: [
        {
          field: 'source',
          operator: 'equals',
          value: 'web',
        },
      ],
      actions: [
        {
          type: 'send_message',
          template: 'Hello',
        },
      ],
    })

    expect(parsed).toMatchObject({
      name: 'Test rule',
      trigger_type: 'message_received',
    })
  })

  it('rejects empty actions', () => {
    expect(() =>
      createRuleSchema.parse({
        name: 'Missing action',
        trigger_type: 'lead_created',
        conditions: [
          {
            field: 'source',
            operator: 'equals',
          },
        ],
        actions: [],
      }),
    ).toThrow()
  })

  it('allows partial update schema', () => {
    const parsed = updateRuleSchema.parse({
      name: 'Updated name',
      is_active: false,
    })

    expect(parsed).toEqual({ name: 'Updated name', is_active: false })
  })
})
