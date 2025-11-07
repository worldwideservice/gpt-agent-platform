import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем KommoAPI
const mockKommoAPI = {
  createLead: vi.fn(),
  updateLead: vi.fn(),
  createContact: vi.fn(),
  updateContact: vi.fn(),
  createTask: vi.fn(),
  sendEmailFromLead: vi.fn(),
  createCallNote: vi.fn(),
  createMeetingNote: vi.fn(),
  createNote: vi.fn(),
  getLead: vi.fn(),
  getContact: vi.fn(),
  getTasksByEntity: vi.fn(),
  getNotesByEntity: vi.fn(),
}

// Создаем класс-мок для KommoAPI
class MockKommoAPI {
  constructor() {
    return mockKommoAPI
  }
}

vi.mock('@/lib/crm/kommo', () => ({
  KommoAPI: MockKommoAPI,
}))

// Мокаем Supabase
const createMockQuery = () => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    single: vi.fn(),
  }
  return query
}

const mockSupabaseClient = createMockQuery()

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

describe('KommoActionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with organizationId', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      expect(service).toBeDefined()
    })
  })

  describe('initializeKommoApi', () => {
    it('should initialize Kommo API with settings from database', async () => {
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await service.initializeKommoApi()

      expect(result).toBe(true)
      expect(mockQuery.eq).toHaveBeenCalledWith('org_id', 'org-123')
      expect(mockQuery.eq).toHaveBeenCalledWith('crm_type', 'kommo')
    })

    it('should return false if settings not found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await service.initializeKommoApi()

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await service.initializeKommoApi()

      expect(result).toBe(false)
    })
  })

  describe('executeAction', () => {
    it('should execute create_lead action', async () => {
      const mockLead = { id: 1, name: 'Test Lead' }
      vi.mocked(mockKommoAPI.createLead).mockResolvedValue(mockLead)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      // Инициализируем API
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_lead',
        data: { name: 'Test Lead', price: 1000 },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.createLead).toHaveBeenCalled()
    })

    it('should execute update_lead action', async () => {
      const mockLead = { id: 1, name: 'Updated Lead' }
      vi.mocked(mockKommoAPI.updateLead).mockResolvedValue(mockLead)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'update_lead',
        entityId: 1,
        data: { name: 'Updated Lead' },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.updateLead).toHaveBeenCalledWith(1, { name: 'Updated Lead' })
    })

    it('should execute create_contact action', async () => {
      const mockContact = { id: 1, name: 'Test Contact' }
      vi.mocked(mockKommoAPI.createContact).mockResolvedValue(mockContact)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_contact',
        data: { name: 'Test Contact', phone: '+1234567890' },
      })

      expect(result).toEqual(mockContact)
      expect(mockKommoAPI.createContact).toHaveBeenCalled()
    })

    it('should execute create_task action', async () => {
      const mockTask = { id: 1, text: 'Test Task' }
      vi.mocked(mockKommoAPI.createTask).mockResolvedValue(mockTask)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_task',
        entityId: 123,
        entityType: 'leads',
        data: { text: 'Test Task' },
      })

      expect(result).toEqual(mockTask)
      expect(mockKommoAPI.createTask).toHaveBeenCalled()
    })

    it('should throw error for unknown action type', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      await expect(
        service.executeAction({
          type: 'unknown_action' as any,
          data: {},
        }),
      ).rejects.toThrow('Неизвестный тип действия')
    })

    it('should initialize API if not initialized', async () => {
      const mockLead = { id: 1, name: 'Test Lead' }
      vi.mocked(mockKommoAPI.createLead).mockResolvedValue(mockLead)

      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await service.executeAction({
        type: 'create_lead',
        data: { name: 'Test Lead' },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.createLead).toHaveBeenCalled()
    })

    it('should throw error if API initialization fails', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      await expect(
        service.executeAction({
          type: 'create_lead',
          data: { name: 'Test Lead' },
        }),
      ).rejects.toThrow('Kommo API не инициализирован')
    })
  })

  describe('getAvailableActions', () => {
    it('should return list of available actions', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const actions = service.getAvailableActions()

      expect(actions).toBeDefined()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions.length).toBeGreaterThan(0)
      expect(actions[0]).toHaveProperty('type')
      expect(actions[0]).toHaveProperty('name')
      expect(actions[0]).toHaveProperty('description')
      expect(actions[0]).toHaveProperty('required_fields')
      expect(actions[0]).toHaveProperty('optional_fields')
    })

    it('should include create_lead action', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const actions = service.getAvailableActions()
      const createLeadAction = actions.find((a) => a.type === 'create_lead')

      expect(createLeadAction).toBeDefined()
      expect(createLeadAction?.required_fields).toContain('name')
    })
  })

  describe('getLeadContext', () => {
    it('should get lead context with contacts, tasks, and notes', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
        _embedded: {
          contacts: [{ id: 456 }],
        },
      }
      const mockContact = { id: 456, name: 'Test Contact' }
      const mockTasks = [{ id: 1, text: 'Task 1' }]
      const mockNotes = [{ id: 1, text: 'Note 1' }]

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getContact).mockResolvedValue(mockContact as any)
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks as any)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.getLeadContext(123)

      expect(result.lead).toEqual(mockLead)
      expect(result.contacts).toHaveLength(1)
      expect(result.contacts[0]).toEqual(mockContact)
      expect(result.tasks).toEqual(mockTasks)
      expect(result.notes).toEqual(mockNotes)
    })

    it('should handle missing contacts gracefully', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
      }
      const mockTasks = []
      const mockNotes = []

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.getLeadContext(123)

      expect(result.contacts).toEqual([])
    })

    it('should handle contact loading errors gracefully', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
        _embedded: {
          contacts: [{ id: 456 }],
        },
      }
      const mockTasks = []
      const mockNotes = []

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getContact).mockRejectedValue(new Error('Contact not found'))
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.getLeadContext(123)

      expect(result.contacts).toEqual([])
    })
  })

  describe('createLead with contact', () => {
    it('should create lead with contact when contact data provided', async () => {
      const mockContact = { id: 456, name: 'Test Contact' }
      const mockLead = { id: 123, name: 'Test Lead', _embedded: { contacts: [{ id: 456 }] } }

      vi.mocked(mockKommoAPI.createContact).mockResolvedValue(mockContact as any)
      vi.mocked(mockKommoAPI.createLead).mockResolvedValue(mockLead as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_lead',
        data: {
          name: 'Test Lead',
          contact_name: 'Test Contact',
          contact_phone: '+1234567890',
          contact_email: 'test@example.com',
        },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.createContact).toHaveBeenCalled()
      expect(mockKommoAPI.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          _embedded: {
            contacts: [{ id: 456 }],
          },
        }),
      )
    })
  })

  describe('executeAction - other actions', () => {
    it('should execute update_contact action', async () => {
      const mockContact = { id: 456, name: 'Updated Contact' }
      vi.mocked(mockKommoAPI.updateContact).mockResolvedValue(mockContact as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'update_contact',
        entityId: 456,
        data: { name: 'Updated Contact' },
      })

      expect(result).toEqual(mockContact)
      expect(mockKommoAPI.updateContact).toHaveBeenCalledWith(456, { name: 'Updated Contact' })
    })

    it('should execute send_email action without template', async () => {
      const mockEmailResult = { id: 1 }
      vi.mocked(mockKommoAPI.sendEmailFromLead).mockResolvedValue(mockEmailResult as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'send_email',
        entityId: 123,
        data: {
          to: ['test@example.com'],
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
        },
      })

      expect(result).toEqual(mockEmailResult)
      expect(mockKommoAPI.sendEmailFromLead).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          to: ['test@example.com'],
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
        }),
      )
    })

    it('should execute create_call_note action', async () => {
      const mockNote = { id: 1, note_type: 'call_in' }
      vi.mocked(mockKommoAPI.createCallNote).mockResolvedValue(mockNote as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_call_note',
        entityId: 123,
        entityType: 'leads',
        data: {
          phone: '+1234567890',
          direction: 'in',
          status: 'success',
          duration: 60,
        },
      })

      expect(result).toEqual(mockNote)
      expect(mockKommoAPI.createCallNote).toHaveBeenCalled()
    })

    it('should execute create_meeting_note action', async () => {
      const mockNote = { id: 1, note_type: 'meeting' }
      vi.mocked(mockKommoAPI.createMeetingNote).mockResolvedValue(mockNote as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_meeting_note',
        entityId: 123,
        entityType: 'leads',
        data: {
          text: 'Meeting about project',
          date: '2025-01-26T10:00:00Z',
        },
      })

      expect(result).toEqual(mockNote)
      expect(mockKommoAPI.createMeetingNote).toHaveBeenCalled()
    })

    it('should execute add_note action', async () => {
      const mockNote = { id: 1, note_type: 'common' }
      vi.mocked(mockKommoAPI.createNote).mockResolvedValue(mockNote as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'add_note',
        entityId: 123,
        entityType: 'leads',
        data: {
          note_type: 'common',
          params: { text: 'Test note' },
        },
      })

      expect(result).toEqual(mockNote)
      expect(mockKommoAPI.createNote).toHaveBeenCalled()
    })
  })

  describe('createLead with custom fields', () => {
    it('should create lead with custom fields when no contact', async () => {
      const mockLead = { id: 123, name: 'Test Lead' }
      vi.mocked(mockKommoAPI.createLead).mockResolvedValue(mockLead as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_lead',
        data: {
          name: 'Test Lead',
          custom_fields: {
            '123': 'Field Value 1',
            '456': 'Field Value 2',
          },
        },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_fields_values: expect.arrayContaining([
            { field_id: 123, values: [{ value: 'Field Value 1' }] },
            { field_id: 456, values: [{ value: 'Field Value 2' }] },
          ]),
        }),
      )
    })
  })

  describe('getEmailTemplate error handling', () => {
    it('should return null if template not found', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await (service as any).getEmailTemplate('non-existent-template')

      expect(result).toBeNull()
    })
  })

  describe('sendEmail with template', () => {
    it('should send email with template', async () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Welcome Email',
        subject: 'Welcome {{name}}',
        html: '<p>Hello {{name}}</p>',
        variables: ['name'],
      }

      const mockEmailResult = { id: 1 }

      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockTemplate, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)
      vi.mocked(mockKommoAPI.sendEmailFromLead).mockResolvedValue(mockEmailResult)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const settingsQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from
        .mockReturnValueOnce(settingsQuery) // для initializeKommoApi
        .mockReturnValueOnce(mockQuery) // для getEmailTemplate

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'send_email',
        entityId: 123,
        data: {
          to: ['test@example.com'],
          subject: 'Test',
          html: 'Test',
          template_id: 'template-1',
          variables: { name: 'John' },
        },
      })

      expect(result).toEqual(mockEmailResult)
      expect(mockKommoAPI.sendEmailFromLead).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          subject: 'Welcome John',
          html: '<p>Hello John</p>',
        }),
      )
    })

    it('should handle missing template gracefully', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)
      const mockEmailResult = { id: 1 }
      vi.mocked(mockKommoAPI.sendEmailFromLead).mockResolvedValue(mockEmailResult)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const settingsQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from
        .mockReturnValueOnce(settingsQuery) // для initializeKommoApi
        .mockReturnValueOnce(mockQuery) // для getEmailTemplate (не найден)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'send_email',
        entityId: 123,
        data: {
          to: ['test@example.com'],
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
          template_id: 'non-existent',
        },
      })

      expect(result).toEqual(mockEmailResult)
      // Используется исходный subject и html, так как шаблон не найден
      expect(mockKommoAPI.sendEmailFromLead).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          subject: 'Test Subject',
          html: '<p>Test HTML</p>',
        }),
      )
    })
  })

  describe('processTemplate', () => {
    it('should process template with variables', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const template = 'Hello {{name}}, your order {{order_id}} is ready!'
      const variables = {
        name: 'John',
        order_id: '12345',
      }

      const result = (service as any).processTemplate(template, variables)

      expect(result).toBe('Hello John, your order 12345 is ready!')
    })

    it('should handle template without variables', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const template = 'Hello World!'
      const variables = {}

      const result = (service as any).processTemplate(template, variables)

      expect(result).toBe('Hello World!')
    })

    it('should handle multiple occurrences of same variable', async () => {
      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const template = '{{name}} says hello to {{name}}'
      const variables = {
        name: 'John',
      }

      const result = (service as any).processTemplate(template, variables)

      expect(result).toBe('John says hello to John')
    })
  })

  describe('createContact with custom fields', () => {
    it('should create contact with phone and email custom fields', async () => {
      const mockContact = { id: 456, name: 'Test Contact' }
      vi.mocked(mockKommoAPI.createContact).mockResolvedValue(mockContact as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_contact',
        data: {
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john@example.com',
        },
      })

      expect(result).toEqual(mockContact)
      expect(mockKommoAPI.createContact).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          first_name: 'John',
          last_name: 'Doe',
          custom_fields_values: expect.arrayContaining([
            { field_id: 1, values: [{ value: '+1234567890' }] },
            { field_id: 2, values: [{ value: 'john@example.com' }] },
          ]),
        }),
      )
    })

    it('should handle single name contact', async () => {
      const mockContact = { id: 456, name: 'John' }
      vi.mocked(mockKommoAPI.createContact).mockResolvedValue(mockContact as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_contact',
        data: {
          name: 'John',
        },
      })

      expect(result).toEqual(mockContact)
      expect(mockKommoAPI.createContact).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          first_name: 'John',
          last_name: '',
        }),
      )
    })
  })

  describe('createTask with defaults', () => {
    it('should create task with default values', async () => {
      const mockTask = { id: 1, text: 'Test Task' }
      vi.mocked(mockKommoAPI.createTask).mockResolvedValue(mockTask as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_task',
        entityId: 123,
        entityType: 'leads',
        data: {
          text: 'Test Task',
        },
      })

      expect(result).toEqual(mockTask)
      expect(mockKommoAPI.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Test Task',
          entity_id: 123,
          entity_type: 'leads',
          task_type_id: 1, // default
        }),
      )
    })
  })

  describe('getLeadContext - initialization', () => {
    it('should initialize API if not initialized when getting lead context', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
      }
      const mockTasks = []
      const mockNotes = []

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes)

      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await service.getLeadContext(123)

      expect(result.lead).toEqual(mockLead)
      expect(result.tasks).toEqual(mockTasks)
      expect(result.notes).toEqual(mockNotes)
    })

    it('should handle multiple contacts in lead context', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
        _embedded: {
          contacts: [{ id: 456 }, { id: 789 }],
        },
      }
      const mockContacts = [
        { id: 456, name: 'Contact 1' },
        { id: 789, name: 'Contact 2' },
      ]
      const mockTasks = []
      const mockNotes = []

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getContact)
        .mockResolvedValueOnce(mockContacts[0] as any)
        .mockResolvedValueOnce(mockContacts[1] as any)
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes)

      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      await service.initializeKommoApi()

      const result = await service.getLeadContext(123)

      expect(result.contacts).toHaveLength(2)
      expect(result.contacts[0].name).toBe('Contact 1')
      expect(result.contacts[1].name).toBe('Contact 2')
    })

    it('should handle partial contact loading errors', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
        _embedded: {
          contacts: [{ id: 456 }, { id: 789 }],
        },
      }
      const mockContact = { id: 456, name: 'Contact 1' }
      const mockTasks = []
      const mockNotes = []

      vi.mocked(mockKommoAPI.getLead).mockResolvedValue(mockLead as any)
      vi.mocked(mockKommoAPI.getContact)
        .mockResolvedValueOnce(mockContact as any)
        .mockRejectedValueOnce(new Error('Contact not found'))
      vi.mocked(mockKommoAPI.getTasksByEntity).mockResolvedValue(mockTasks)
      vi.mocked(mockKommoAPI.getNotesByEntity).mockResolvedValue(mockNotes)

      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      await service.initializeKommoApi()

      const result = await service.getLeadContext(123)

      // Должен загрузить только один контакт (первый успешно, второй с ошибкой игнорируется)
      expect(result.contacts).toHaveLength(1)
      expect(result.contacts[0].name).toBe('Contact 1')
    })
  })

  describe('getEmailTemplate - error handling', () => {
    it('should return null on database error', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await (service as any).getEmailTemplate('non-existent-template')

      expect(result).toBeNull()
    })

    it('should return null on exception', async () => {
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => {
          throw new Error('Unexpected error')
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')

      const result = await (service as any).getEmailTemplate('template-id')

      expect(result).toBeNull()
    })
  })

  describe('createLead - edge cases', () => {
    it('should handle lead without contact and without custom_fields', async () => {
      const mockLead = { id: 123, name: 'Test Lead' }
      vi.mocked(mockKommoAPI.createLead).mockResolvedValue(mockLead as any)

      const { KommoActionsService } = await import('@/lib/services/kommo-actions')
      const service = new KommoActionsService('org-123')
      
      const mockSettings = {
        config: {
          domain: 'test-domain',
          client_id: 'client-id',
          client_secret: 'client-secret',
          redirect_uri: 'https://example.com/callback',
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      }
      const mockQuery: any = {
        select: vi.fn(function (this: any) {
          return this
        }),
        eq: vi.fn(function (this: any) {
          return this
        }),
        single: vi.fn(() => Promise.resolve({ data: mockSettings, error: null })),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await service.initializeKommoApi()

      const result = await service.executeAction({
        type: 'create_lead',
        data: {
          name: 'Test Lead',
        },
      })

      expect(result).toEqual(mockLead)
      expect(mockKommoAPI.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Lead',
        })
      )
    })
  })
})

