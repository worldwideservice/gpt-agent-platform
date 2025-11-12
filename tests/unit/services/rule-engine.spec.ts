import { describe, expect, it, vi } from 'vitest'

import { __testable } from '@/lib/services/rule-engine'

const mockKommoApi = {
  createNote: vi.fn(),
  updateLead: vi.fn(),
  createTask: vi.fn(),
}

vi.mock('@/lib/repositories/crm-connection', () => ({
  createKommoApiForOrg: vi.fn().mockResolvedValue(mockKommoApi),
}))

describe('rule engine kommo actions', () => {
  beforeEach(() => {
    mockKommoApi.createNote.mockReset()
    mockKommoApi.updateLead.mockReset()
    mockKommoApi.createTask.mockReset()
  })

  it('sends a note via kommo', async () => {
    const result = await __testable.executeSendMessage(
      { type: 'send_message', template: 'Привет' },
      { organizationId: 'org', leadId: '42', triggerType: 'manual', triggerData: {} },
    )
    expect(mockKommoApi.createNote).toHaveBeenCalledWith({
      entity_id: 42,
      entity_type: 'leads',
      note_type: 'common',
      params: {
        text: 'Привет',
        source: 'rule_engine',
      },
    })
    expect(result).toBe(true)
  })

  it('changes stage via kommo update', async () => {
    const result = await __testable.executeChangeStage(
      { type: 'change_stage', newValue: '123' },
      {
        organizationId: 'org',
        leadId: '77',
        triggerType: 'manual',
        triggerData: {},
      },
    )
    expect(mockKommoApi.updateLead).toHaveBeenCalledWith(77, { status_id: 123 })
    expect(result).toBe(true)
  })

  it('creates task with responsible user fallback', async () => {
    const result = await __testable.executeCreateTask(
      { type: 'create_task', template: 'Task body' },
      {
        organizationId: 'org',
        leadId: '99',
        triggerType: 'manual',
        triggerData: { responsible_user_id: '5' },
      },
    )
    expect(mockKommoApi.createTask).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Task body',
        entity_id: 99,
        responsible_user_id: 5,
      }),
    )
    expect(result).toBe(true)
  })

  it('updates field via kommo updateLead', async () => {
    const result = await __testable.executeUpdateField(
      { type: 'update_field', targetField: 'status_id', newValue: '321' },
      { organizationId: 'org', leadId: '11', triggerType: 'manual', triggerData: {} },
    )
    expect(mockKommoApi.updateLead).toHaveBeenCalledWith(11, { status_id: '321' })
    expect(result).toBe(true)
  })
})
