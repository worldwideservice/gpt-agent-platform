import { describe, it, expect, vi, beforeEach } from 'vitest'

// Мокаем fetch перед импортом
const mockFetch = vi.fn()
global.fetch = mockFetch

// Импортируем после мока
import { KommoAPI } from '@/lib/crm/kommo'

describe('KommoAPI', () => {
  const mockConfig = {
    domain: 'test-domain',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'https://example.com/callback',
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with correct baseUrl for subdomain', () => {
      const api = new KommoAPI(mockConfig)
      expect(api.getBaseUrl()).toBe('https://test-domain.kommo.com/api/v4')
    })

    it('should handle domain with .kommo.com', () => {
      const config = { ...mockConfig, domain: 'test.kommo.com' }
      const api = new KommoAPI(config)
      expect(api.getBaseUrl()).toBe('https://test.kommo.com/api/v4')
    })

    it('should handle domain with .amocrm.ru', () => {
      const config = { ...mockConfig, domain: 'test.amocrm.ru' }
      const api = new KommoAPI(config)
      expect(api.getBaseUrl()).toBe('https://test.amocrm.ru/api/v4')
    })

    it('should handle domain with http:// prefix', () => {
      const config = { ...mockConfig, domain: 'http://test.kommo.com' }
      const api = new KommoAPI(config)
      expect(api.getBaseUrl()).toBe('https://test.kommo.com/api/v4')
    })

    it('should handle domain with https:// prefix', () => {
      const config = { ...mockConfig, domain: 'https://test.kommo.com' }
      const api = new KommoAPI(config)
      expect(api.getBaseUrl()).toBe('https://test.kommo.com/api/v4')
    })

    it('should handle domain with /api/v4 path', () => {
      const config = { ...mockConfig, domain: 'https://test.kommo.com/api/v4' }
      const api = new KommoAPI(config)
      expect(api.getBaseUrl()).toBe('https://test.kommo.com/api/v4')
    })
  })

  describe('getBaseUrl', () => {
    it('should return base URL', () => {
      const api = new KommoAPI(mockConfig)
      expect(api.getBaseUrl()).toBe('https://test-domain.kommo.com/api/v4')
    })
  })

  describe('getConfig', () => {
    it('should return copy of config', () => {
      const api = new KommoAPI(mockConfig)
      const config = api.getConfig()
      
      expect(config).toEqual(mockConfig)
      expect(config).not.toBe(mockConfig) // Должна быть копия
    })
  })

  describe('getAccessToken', () => {
    it('should get access token with authorization code', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getAccessToken('auth-code')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.amocrm.ru/oauth2/access_token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: 'test-client-id',
            client_secret: 'test-client-secret',
            grant_type: 'authorization_code',
            code: 'auth-code',
            redirect_uri: 'https://example.com/callback',
          }),
        }),
      )
    })

    it('should throw error if request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })

      const api = new KommoAPI(mockConfig)
      
      await expect(api.getAccessToken('invalid-code')).rejects.toThrow('Kommo API Error: Bad Request')
    })
  })

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      const mockResponse = {
        access_token: 'refreshed-access-token',
        refresh_token: 'refreshed-refresh-token',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.refreshAccessToken()

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.amocrm.ru/oauth2/access_token',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            client_id: 'test-client-id',
            client_secret: 'test-client-secret',
            grant_type: 'refresh_token',
            refresh_token: 'test-refresh-token',
            redirect_uri: 'https://example.com/callback',
          }),
        }),
      )
    })

    it('should throw error if refresh token not provided', async () => {
      const configWithoutRefresh = { ...mockConfig, refreshToken: undefined }
      const api = new KommoAPI(configWithoutRefresh)

      await expect(api.refreshAccessToken()).rejects.toThrow('Refresh token not provided')
    })

    it('should throw error if request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      })

      const api = new KommoAPI(mockConfig)
      
      await expect(api.refreshAccessToken()).rejects.toThrow('Kommo API Error: Unauthorized')
    })
  })

  describe('createLead', () => {
    it('should create lead successfully', async () => {
      const mockLead = {
        name: 'Test Lead',
        price: 1000,
      }

      const mockResponse = {
        _embedded: {
          leads: [
            {
              id: 123,
              name: 'Test Lead',
              price: 1000,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createLead(mockLead)

      expect(result.id).toBe(123)
      expect(result.name).toBe('Test Lead')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/leads',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([mockLead]),
        }),
      )
      // Проверяем что headers содержат нужные значения (может быть обновлен после refresh)
      const callArgs = mockFetch.mock.calls.find((call) => 
        call[0] === 'https://test-domain.kommo.com/api/v4/leads' && 
        call[1]?.method === 'POST'
      )
      if (callArgs && callArgs[1] && callArgs[1].headers) {
        expect(callArgs[1].headers).toHaveProperty('Authorization')
        expect(callArgs[1].headers).toHaveProperty('Content-Type', 'application/json')
      }
    })

    it('should throw error if access token not provided', async () => {
      const configWithoutToken = { ...mockConfig, accessToken: undefined }
      const api = new KommoAPI(configWithoutToken)

      await expect(api.createLead({ name: 'Test' })).rejects.toThrow('Access token not provided')
    })
  })

  describe('updateLead', () => {
    it('should update lead successfully', async () => {
      const mockResponse = {
        _embedded: {
          leads: [
            {
              id: 123,
              name: 'Updated Lead',
              price: 2000,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.updateLead(123, { name: 'Updated Lead', price: 2000 })

      expect(result.id).toBe(123)
      expect(result.name).toBe('Updated Lead')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/leads',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify([{ id: 123, name: 'Updated Lead', price: 2000 }]),
        }),
      )
    })
  })

  describe('searchLeads', () => {
    it('should search leads successfully', async () => {
      const mockResponse = {
        _embedded: {
          leads: [
            { id: 1, name: 'Lead 1' },
            { id: 2, name: 'Lead 2' },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.searchLeads('test query')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/leads?query=test%20query',
        expect.any(Object),
      )
    })

    it('should return empty array if no leads found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _embedded: {} }),
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.searchLeads('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe('createContact', () => {
    it('should create contact successfully', async () => {
      const mockContact = {
        name: 'Test Contact',
        first_name: 'Test',
        last_name: 'Contact',
      }

      const mockResponse = {
        _embedded: {
          contacts: [
            {
              id: 456,
              name: 'Test Contact',
              first_name: 'Test',
              last_name: 'Contact',
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createContact(mockContact)

      expect(result.id).toBe(456)
      expect(result.name).toBe('Test Contact')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/contacts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([mockContact]),
        }),
      )
    })
  })

  describe('updateContact', () => {
    it('should update contact successfully', async () => {
      const mockResponse = {
        _embedded: {
          contacts: [
            {
              id: 456,
              name: 'Updated Contact',
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.updateContact(456, { name: 'Updated Contact' })

      expect(result.id).toBe(456)
      expect(result.name).toBe('Updated Contact')
    })
  })

  describe('getContact', () => {
    it('should get contact successfully', async () => {
      const mockContact = {
        id: 456,
        name: 'Test Contact',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockContact,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getContact(456)

      expect(result).toEqual(mockContact)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/contacts/456',
        expect.any(Object),
      )
    })
  })

  describe('searchContacts', () => {
    it('should search contacts successfully', async () => {
      const mockResponse = {
        _embedded: {
          contacts: [
            { id: 1, name: 'Contact 1' },
            { id: 2, name: 'Contact 2' },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.searchContacts('test query')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
    })

    it('should return empty array if no contacts found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _embedded: {} }),
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.searchContacts('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe('request method - token refresh', () => {
    it('should refresh token on 401 and retry request', async () => {
      const mockRefreshResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      }

      const mockApiResponse = {
        _embedded: {
          leads: [
            {
              id: 123,
              name: 'Success',
            },
          ],
        },
      }

      // Первый запрос возвращает 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      })

      // Refresh token запрос
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRefreshResponse,
      })

      // Повторный запрос после refresh
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      })

      const api = new KommoAPI(mockConfig)
      
      // Используем createLead как публичный метод для тестирования request
      const result = await api.createLead({ name: 'Test Lead' })

      expect(result.name).toBe('Success')
      expect(mockFetch).toHaveBeenCalledTimes(3) // 401, refresh, retry
    })

    it('should throw error if token expired and no refresh token', async () => {
      const configWithoutRefresh = { ...mockConfig, refreshToken: undefined }
      const api = new KommoAPI(configWithoutRefresh)

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      })

      await expect(api.createLead({ name: 'Test' })).rejects.toThrow(
        'Access token expired and no refresh token available',
      )
    })
  })

  describe('parseWebhook', () => {
    it('should parse leads webhook', () => {
      const payload = {
        leads: {
          status: [{ id: 1, status_id: 123 }],
        },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('leads')
      expect(result.data).toEqual(payload.leads)
    })

    it('should parse contacts webhook', () => {
      const payload = {
        contacts: {
          add: [{ id: 1, name: 'Test' }],
        },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('contacts')
      expect(result.data).toEqual(payload.contacts)
    })

    it('should parse tasks webhook', () => {
      const payload = {
        tasks: {
          add: [{ id: 1, text: 'Task' }],
        },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('tasks')
      expect(result.data).toEqual(payload.tasks)
    })

    it('should parse messages webhook', () => {
      const payload = {
        messages: [{ id: 1, entity_id: 123 }],
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('messages')
      expect(result.data).toEqual(payload.messages)
    })

    it('should parse calls webhook', () => {
      const payload = {
        calls: [{ id: 1, entity_id: 123 }],
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('calls')
      expect(result.data).toEqual(payload.calls)
    })

    it('should parse customers webhook', () => {
      const payload = {
        customers: {
          add: [{ id: 1, name: 'Customer' }],
        },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('customers')
      expect(result.data).toEqual(payload.customers)
    })

    it('should parse companies webhook', () => {
      const payload = {
        companies: {
          add: [{ id: 1, name: 'Company' }],
        },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('companies')
      expect(result.data).toEqual(payload.companies)
    })

    it('should parse webhook with account metadata', () => {
      const payload = {
        account: { base_domain: 'test.kommo.com' },
        leads: { status: [{ id: 1 }] },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('leads')
      expect(result.data).toEqual(payload.leads)
    })

    it('should return unknown type for unrecognized payload', () => {
      const payload = {
        unknown_event: { data: 'test' },
      }

      const result = KommoAPI.parseWebhook(payload)

      expect(result.type).toBe('unknown')
      expect(result.data).toEqual(payload)
    })
  })

  describe('getLead', () => {
    it('should get lead by id', async () => {
      const mockLead = {
        id: 123,
        name: 'Test Lead',
        price: 1000,
        status_id: 142,
        pipeline_id: 1,
      }

      const mockResponse = {
        _embedded: {
          leads: [mockLead],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLead(123)

      expect(result.id).toBe(123)
      expect(result.name).toBe('Test Lead')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/leads?id=123',
        expect.any(Object),
      )
    })

    it('should throw error if lead not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _embedded: {} }),
      })

      const api = new KommoAPI(mockConfig)
      
      await expect(api.getLead(999)).rejects.toThrow('Lead 999 not found')
    })
  })

  describe('getLeads', () => {
    it('should get list of leads', async () => {
      const mockResponse = {
        _embedded: {
          leads: [
            { id: 1, name: 'Lead 1', price: 1000, status_id: 142 },
            { id: 2, name: 'Lead 2', price: 2000, status_id: 143 },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeads()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(2)
    })

    it('should return empty array if no leads', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _embedded: {} }),
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeads()

      expect(result).toEqual([])
    })
  })

  describe('getPipelines', () => {
    it('should get pipelines', async () => {
      const mockResponse = {
        _embedded: {
          pipelines: [
            {
              id: 1,
              name: 'Sales Pipeline',
              _embedded: {
                statuses: [
                  { id: 142, name: 'New', sort: 1 },
                  { id: 143, name: 'In Progress', sort: 2 },
                ],
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getPipelines()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
      expect(result[0].name).toBe('Sales Pipeline')
      expect(result[0]._embedded.statuses).toHaveLength(2)
    })
  })

  describe('getUsers', () => {
    it('should get users', async () => {
      const mockResponse = {
        _embedded: {
          users: [
            { id: 1, name: 'User 1', email: 'user1@example.com', lang: 'ru' },
            { id: 2, name: 'User 2', email: 'user2@example.com', lang: 'en' },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getUsers()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[0].name).toBe('User 1')
    })

    it('should return empty array if no users', async () => {
      const mockResponse = {
        _embedded: {
          users: [],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getUsers()

      expect(result).toEqual([])
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const mockTask = {
        text: 'Test Task',
        complete_till: Date.now() + 86400000,
        task_type_id: 1,
        responsible_user_id: 1,
        entity_id: 123,
        entity_type: 'leads' as const,
      }

      const mockResponse = {
        _embedded: {
          tasks: [
            {
              id: 789,
              ...mockTask,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createTask(mockTask)

      expect(result.id).toBe(789)
      expect(result.text).toBe('Test Task')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([mockTask]),
        }),
      )
    })
  })

  describe('addNoteToLead', () => {
    it('should add note to lead', async () => {
      const mockNote = {
        note_type: 'common',
        params: { text: 'Test note' },
      }

      const mockResponse = {
        _embedded: {
          notes: [{ id: 1, ...mockNote }],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.addNoteToLead(123, mockNote)

      expect(result).toBeDefined()
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/leads/123/notes',
        expect.objectContaining({
          method: 'POST',
        }),
      )
    })
  })

  describe('request error handling', () => {
    it('should handle API errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid request' }),
      })

      const api = new KommoAPI(mockConfig)
      
      await expect(api.createLead({ name: 'Test' })).rejects.toThrow('Kommo API Error: Invalid request')
    })

    it('should handle API errors without message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      const api = new KommoAPI(mockConfig)
      
      await expect(api.createLead({ name: 'Test' })).rejects.toThrow('Kommo API Error: Internal Server Error')
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const mockResponse = {
        _embedded: {
          tasks: [
            {
              id: 789,
              text: 'Updated Task',
              complete_till: Date.now(),
              task_type_id: 1,
              responsible_user_id: 1,
              entity_id: 123,
              entity_type: 'leads',
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.updateTask(789, { text: 'Updated Task' })

      expect(result.id).toBe(789)
      expect(result.text).toBe('Updated Task')
    })
  })

  describe('getTasksByEntity', () => {
    it('should get tasks by entity', async () => {
      const mockResponse = {
        _embedded: {
          tasks: [
            { id: 1, text: 'Task 1', entity_id: 123, entity_type: 'leads' },
            { id: 2, text: 'Task 2', entity_id: 123, entity_type: 'leads' },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getTasksByEntity(123, 'leads')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
    })

    it('should return empty array if no tasks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _embedded: {} }),
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getTasksByEntity(999, 'leads')

      expect(result).toEqual([])
    })
  })

  describe('createNote', () => {
    it('should create note successfully', async () => {
      const mockNote = {
        entity_id: 123,
        entity_type: 'leads' as const,
        note_type: 'common' as const,
        params: { text: 'Test note' },
      }

      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 1,
              ...mockNote,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createNote(mockNote)

      expect(result.id).toBe(1)
      expect(result.params.text).toBe('Test note')
    })
  })

  describe('getNotesByEntity', () => {
    it('should get notes by entity', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            { id: 1, entity_id: 123, entity_type: 'leads', note_type: 'common', params: {} },
            { id: 2, entity_id: 123, entity_type: 'leads', note_type: 'common', params: {} },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getNotesByEntity(123, 'leads')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
    })
  })

  describe('sendEmailFromLead', () => {
    it('should send email from lead', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 1,
              entity_id: 123,
              entity_type: 'leads',
              note_type: 'mail_message',
              params: {
                subject: 'Test Subject',
                html: 'Test HTML',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.sendEmailFromLead(123, {
        to: ['test@example.com'],
        subject: 'Test Subject',
        html: 'Test HTML',
      })

      expect(result).toBeDefined()
    })

    it('should send email with all optional parameters', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 1,
              entity_id: 123,
              entity_type: 'leads',
              note_type: 'mail_message',
              params: {
                subject: 'Test Subject',
                html: 'Test HTML',
                text: 'Test Text',
                from: 'sender@example.com',
                to: 'test@example.com',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.sendEmailFromLead(123, {
        to: ['test@example.com'],
        subject: 'Test Subject',
        html: 'Test HTML',
        text: 'Test Text',
        from: 'sender@example.com',
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com'],
      })

      expect(result).toBeDefined()
      const callArgs = mockFetch.mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      expect(body[0].params).toHaveProperty('text', 'Test Text')
      expect(body[0].params).toHaveProperty('from', 'sender@example.com')
    })
  })

  describe('createCallNote', () => {
    it('should create call note for incoming call', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 1,
              entity_id: 123,
              entity_type: 'leads',
              note_type: 'call_in',
              params: {
                phone: '+1234567890',
                duration: 60,
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createCallNote(123, 'leads', {
        phone: '+1234567890',
        direction: 'in',
        status: 'success',
        duration: 60,
      })

      expect(result.note_type).toBe('call_in')
    })

    it('should create call note for outgoing call', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 2,
              entity_id: 123,
              entity_type: 'leads',
              note_type: 'call_out',
              params: {
                phone: '+1234567890',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createCallNote(123, 'leads', {
        phone: '+1234567890',
        direction: 'out',
        status: 'success',
      })

      expect(result.note_type).toBe('call_out')
    })

    it('should create call note with text and different statuses', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 3,
              entity_id: 456,
              entity_type: 'contacts',
              note_type: 'call_in',
              params: {
                phone: '+9876543210',
                text: 'Call failed',
                status: 2, // failed
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createCallNote(456, 'contacts', {
        phone: '+9876543210',
        direction: 'in',
        status: 'failed',
        text: 'Call failed',
      })

      expect(result.note_type).toBe('call_in')
      expect(result.params.text).toBe('Call failed')
    })

    it('should create call note for companies entity', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 4,
              entity_id: 789,
              entity_type: 'companies',
              note_type: 'call_out',
              params: {
                phone: '+1111111111',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createCallNote(789, 'companies', {
        phone: '+1111111111',
        direction: 'out',
        status: 'busy',
      })

      expect(result.note_type).toBe('call_out')
    })
  })

  describe('createMeetingNote', () => {
    it('should create meeting note', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 1,
              entity_id: 123,
              entity_type: 'leads',
              note_type: 'meeting',
              params: {
                text: 'Meeting about project',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createMeetingNote(123, 'leads', {
        text: 'Meeting about project',
        date: '2025-01-26T10:00:00Z',
      })

      expect(result.note_type).toBe('meeting')
      expect(result.params.text).toBe('Meeting about project')
    })

    it('should create meeting note with duration', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 2,
              entity_id: 456,
              entity_type: 'contacts',
              note_type: 'meeting',
              params: {
                text: 'Long meeting',
                duration: 120,
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createMeetingNote(456, 'contacts', {
        text: 'Long meeting',
        date: '2025-01-26T10:00:00Z',
        duration: 120,
      })

      expect(result.params.duration).toBe(120)
    })

    it('should create meeting note for companies', async () => {
      const mockResponse = {
        _embedded: {
          notes: [
            {
              id: 3,
              entity_id: 789,
              entity_type: 'companies',
              note_type: 'meeting',
              params: {
                text: 'Company meeting',
              },
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createMeetingNote(789, 'companies', {
        text: 'Company meeting',
        date: '2025-01-26T10:00:00Z',
      })

      expect(result.note_type).toBe('meeting')
    })
  })

  describe('getCustomFields', () => {
    it('should get custom fields', async () => {
      const mockResponse = {
        _embedded: {
          custom_fields: [
            {
              id: 1,
              name: 'Custom Field 1',
              type: 'text',
              code: 'CUSTOM_FIELD_1',
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getCustomFields()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('createCustomField', () => {
    it('should create custom field successfully', async () => {
      const mockField = {
        name: 'New Custom Field',
        type: 'text',
        code: 'NEW_FIELD',
      }

      const mockResponse = {
        _embedded: {
          custom_fields: [
            {
              id: 123,
              ...mockField,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.createCustomField(mockField)

      expect(result.id).toBe(123)
      expect(result.name).toBe('New Custom Field')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-domain.kommo.com/api/v4/custom_fields',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify([mockField]),
        }),
      )
    })
  })

  describe('getEmailTemplates', () => {
    it('should return empty array for email templates', async () => {
      const api = new KommoAPI(mockConfig)
      const result = await api.getEmailTemplates()

      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getLeadsStats', () => {
    it('should get leads statistics', async () => {
      const mockResponse = {
        _embedded: {
          leads: [
            { id: 1, status_id: 142, pipeline_id: 1 },
            { id: 2, status_id: 143, pipeline_id: 1 },
            { id: 3, status_id: 142, pipeline_id: 2 },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeadsStats()

      expect(result.total).toBe(3)
      expect(result.by_status[142]).toBe(2)
      expect(result.by_status[143]).toBe(1)
      expect(result.by_pipeline[1]).toBe(2)
      expect(result.by_pipeline[2]).toBe(1)
    })

    it('should handle leads without status_id or pipeline_id', async () => {
      const mockResponse = {
        _embedded: {
          leads: [
            { id: 1, status_id: 142, pipeline_id: 1 },
            { id: 2, status_id: undefined, pipeline_id: 1 },
            { id: 3, status_id: 142, pipeline_id: undefined },
            { id: 4, status_id: undefined, pipeline_id: undefined },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeadsStats()

      expect(result.total).toBe(4)
      expect(result.by_status[142]).toBe(2)
      expect(result.by_pipeline[1]).toBe(2)
    })

    it('should handle empty leads array', async () => {
      const mockResponse = {
        _embedded: {
          leads: [],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeadsStats()

      expect(result.total).toBe(0)
      expect(Object.keys(result.by_status)).toHaveLength(0)
      expect(Object.keys(result.by_pipeline)).toHaveLength(0)
    })

    it('should handle missing _embedded.leads', async () => {
      const mockResponse = {
        _embedded: {},
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const api = new KommoAPI(mockConfig)
      const result = await api.getLeadsStats()

      expect(result.total).toBe(0)
    })
  })
})

describe('Kommo Helper Functions', () => {
  describe('createLeadFromChat', () => {
    it('should create lead from chat data', async () => {
      const { createLeadFromChat } = await import('@/lib/crm/kommo')

      const result = createLeadFromChat('John Doe', '+1234567890', 'john@example.com', 'Hello')

      expect(result.name).toBe('Лид из чата: John Doe')
      expect(result.price).toBe(0)
      expect(result.custom_fields_values).toBeDefined()
      expect(result.custom_fields_values).toHaveLength(2)
    })
  })

  describe('createContactFromChat', () => {
    it('should create contact from chat data with first and last name', async () => {
      const { createContactFromChat } = await import('@/lib/crm/kommo')

      const result = createContactFromChat('John Doe', '+1234567890', 'john@example.com')

      expect(result.name).toBe('John Doe')
      expect(result.first_name).toBe('John')
      expect(result.last_name).toBe('Doe')
      expect(result.custom_fields_values).toBeDefined()
    })

    it('should handle single name', async () => {
      const { createContactFromChat } = await import('@/lib/crm/kommo')

      const result = createContactFromChat('John', '+1234567890', 'john@example.com')

      expect(result.name).toBe('John')
      expect(result.first_name).toBe('John')
      expect(result.last_name).toBe('')
    })

    it('should handle multiple name parts', async () => {
      const { createContactFromChat } = await import('@/lib/crm/kommo')

      const result = createContactFromChat('John Michael Doe', '+1234567890', 'john@example.com')

      expect(result.name).toBe('John Michael Doe')
      expect(result.first_name).toBe('John')
      expect(result.last_name).toBe('Michael Doe')
    })
  })
})

