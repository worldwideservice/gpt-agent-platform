import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

// Mock Supabase admin client
vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(),
}))

// Mock validation
vi.mock('@/lib/validation/validate', () => ({
  validateRequest: vi.fn(),
}))

describe('API: Test Chat System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/manage/[tenantId]/test-chat/agents', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/agents/route')
      const request = new NextRequest('http://localhost:3000/api/manage/test-org/test-chat/agents')
      const response = await route.GET(request, {
        params: { tenantId: 'test-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return list of active agents', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: {
          id: 'user-123',
        },
      } as any)

      const mockAgents = [
        {
          id: 'agent-1',
          name: 'Sales Agent',
          model: 'gpt-4',
          instructions: 'You are a sales assistant',
        },
        {
          id: 'agent-2',
          name: 'Support Agent',
          model: 'gpt-3.5-turbo',
          instructions: 'You are a support assistant',
        },
      ]

      const mockSupabaseClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'org-123' },
                error: null,
              }),
            }),
          }),
        }),
      }

      // Setup chain for agents query
      const mockAgentsFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockAgents,
                error: null,
              }),
            }),
          }),
        }),
      })

      let callCount = 0
      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn((table: string) => {
          callCount++
          if (table === 'organizations' || callCount === 1) {
            return mockSupabaseClient.from(table)
          }
          return mockAgentsFrom(table)
        }),
      } as any)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/agents/route')
      const request = new NextRequest('http://localhost:3000/api/manage/test-org/test-chat/agents')
      const response = await route.GET(request, {
        params: { tenantId: 'test-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.agents).toHaveLength(2)
      expect(data.count).toBe(2)
      expect(data.agents[0].name).toBe('Sales Agent')
    })

    it('should return 404 if organization not found', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: new Error('Not found'),
              }),
            }),
          }),
        }),
      } as any)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/agents/route')
      const request = new NextRequest('http://localhost:3000/api/manage/invalid-org/test-chat/agents')
      const response = await route.GET(request, {
        params: { tenantId: 'invalid-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Organization not found')
    })
  })

  describe('POST /api/manage/[tenantId]/test-chat/conversations', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/manage/test-org/test-chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Chat', agentId: 'agent-1' }),
      })
      const response = await route.POST(request, {
        params: { tenantId: 'test-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create new conversation', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { validateRequest } = await import('@/lib/validation/validate')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(validateRequest).mockResolvedValue({
        data: { title: 'Test Chat', agentId: 'agent-1' },
        error: null,
      } as any)

      const mockConversation = {
        id: 'convo-1',
        title: 'Test Chat',
        agent_id: 'agent-1',
        org_id: 'org-123',
        created_by: 'user-123',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        agents: {
          id: 'agent-1',
          name: 'Test Agent',
          model: 'gpt-4',
        },
      }

      let callIndex = 0
      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn((table: string) => {
          callIndex++

          // First call: get organization
          if (callIndex === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'org-123' },
                    error: null,
                  }),
                }),
              }),
            }
          }

          // Second call: check agent exists
          if (callIndex === 2) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: { id: 'agent-1' },
                      error: null,
                    }),
                  }),
                }),
              }),
            }
          }

          // Third call: insert conversation
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockConversation,
                  error: null,
                }),
              }),
            }),
          }
        }),
      } as any)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/manage/test-org/test-chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Chat', agentId: 'agent-1' }),
      })
      const response = await route.POST(request, {
        params: { tenantId: 'test-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.conversation.id).toBe('convo-1')
      expect(data.conversation.title).toBe('Test Chat')
      expect(data.message).toBe('Conversation created successfully')
    })
  })

  describe('GET /api/manage/[tenantId]/test-chat/conversations', () => {
    it('should return list of conversations', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      const mockConversations = [
        {
          id: 'convo-1',
          title: 'Chat 1',
          agent_id: 'agent-1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          agents: {
            id: 'agent-1',
            name: 'Sales Agent',
            model: 'gpt-4',
          },
        },
      ]

      let callIndex = 0
      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn((table: string) => {
          callIndex++

          // First call: get organization
          if (callIndex === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'org-123' },
                    error: null,
                  }),
                }),
              }),
            }
          }

          // Second call: get conversations
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockConversations,
                    error: null,
                  }),
                }),
              }),
            }),
          }
        }),
      } as any)

      const route = await import('@/app/api/manage/[tenantId]/test-chat/conversations/route')
      const request = new NextRequest('http://localhost:3000/api/manage/test-org/test-chat/conversations')
      const response = await route.GET(request, {
        params: { tenantId: 'test-org' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.conversations).toHaveLength(1)
      expect(data.count).toBe(1)
      expect(data.conversations[0].title).toBe('Chat 1')
    })
  })

  describe('POST /api/manage/[tenantId]/test-chat/conversations/[conversationId]/messages', () => {
    it('should return 401 if not authenticated', async () => {
      const { auth } = await import('@/auth')
      vi.mocked(auth).mockResolvedValue(null)

      const route = await import(
        '@/app/api/manage/[tenantId]/test-chat/conversations/[conversationId]/messages/route'
      )
      const request = new NextRequest(
        'http://localhost:3000/api/manage/test-org/test-chat/conversations/convo-1/messages',
        {
          method: 'POST',
          body: JSON.stringify({ content: 'Hello!', agentId: 'agent-1' }),
        }
      )
      const response = await route.POST(request, {
        params: { tenantId: 'test-org', conversationId: 'convo-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should send message and receive AI response', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
      const { validateRequest } = await import('@/lib/validation/validate')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(validateRequest).mockResolvedValue({
        data: { content: 'Hello Agent!', agentId: 'agent-1' },
        error: null,
      } as any)

      const mockUserMessage = {
        id: 'msg-1',
        conversation_id: 'convo-1',
        org_id: 'org-123',
        role: 'user',
        content: 'Hello Agent!',
        created_at: '2024-01-01T00:00:00Z',
      }

      const mockAssistantMessage = {
        id: 'msg-2',
        conversation_id: 'convo-1',
        org_id: 'org-123',
        role: 'assistant',
        content: 'Hello! How can I help you?',
        metadata: {
          agent_id: 'agent-1',
          agent_name: 'Test Agent',
          model: 'gpt-4',
          tokens_used: 25,
          simulated: true,
        },
        created_at: '2024-01-01T00:00:10Z',
      }

      let callIndex = 0
      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn((table: string) => {
          callIndex++

          // 1. Get organization
          if (callIndex === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'org-123' },
                    error: null,
                  }),
                }),
              }),
            }
          }

          // 2. Check conversation access
          if (callIndex === 2) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                      single: vi.fn().mockResolvedValue({
                        data: { id: 'convo-1', agent_id: 'agent-1' },
                        error: null,
                      }),
                    }),
                  }),
                }),
              }),
            }
          }

          // 3. Get agent data
          if (callIndex === 3) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: {
                        id: 'agent-1',
                        name: 'Test Agent',
                        model: 'gpt-4',
                        instructions: 'You are helpful',
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            }
          }

          // 4. Insert user message
          if (callIndex === 4) {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockUserMessage,
                    error: null,
                  }),
                }),
              }),
            }
          }

          // 5. Get message history
          if (callIndex === 5) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({
                      data: [mockUserMessage],
                      error: null,
                    }),
                  }),
                }),
              }),
            }
          }

          // 6. Insert assistant message
          if (callIndex === 6) {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockAssistantMessage,
                    error: null,
                  }),
                }),
              }),
            }
          }

          // 7. Update conversation timestamp
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }
        }),
      } as any)

      const route = await import(
        '@/app/api/manage/[tenantId]/test-chat/conversations/[conversationId]/messages/route'
      )
      const request = new NextRequest(
        'http://localhost:3000/api/manage/test-org/test-chat/conversations/convo-1/messages',
        {
          method: 'POST',
          body: JSON.stringify({ content: 'Hello Agent!', agentId: 'agent-1' }),
        }
      )
      const response = await route.POST(request, {
        params: { tenantId: 'test-org', conversationId: 'convo-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.userMessage.content).toBe('Hello Agent!')
      expect(data.userMessage.role).toBe('user')
      expect(data.assistantMessage.role).toBe('assistant')
      expect(data.assistantMessage.metadata.simulated).toBe(true)
    })
  })

  describe('DELETE /api/manage/[tenantId]/test-chat/conversations/[conversationId]', () => {
    it('should delete conversation', async () => {
      const { auth } = await import('@/auth')
      const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')

      vi.mocked(auth).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      let callIndex = 0
      vi.mocked(getSupabaseServiceRoleClient).mockReturnValue({
        from: vi.fn((table: string) => {
          callIndex++

          // 1. Get organization
          if (callIndex === 1) {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'org-123' },
                    error: null,
                  }),
                }),
              }),
            }
          }

          // 2. Delete conversation
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({
                    error: null,
                  }),
                }),
              }),
            }),
          }
        }),
      } as any)

      const route = await import(
        '@/app/api/manage/[tenantId]/test-chat/conversations/[conversationId]/route'
      )
      const request = new NextRequest(
        'http://localhost:3000/api/manage/test-org/test-chat/conversations/convo-1',
        { method: 'DELETE' }
      )
      const response = await route.DELETE(request, {
        params: { tenantId: 'test-org', conversationId: 'convo-1' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Conversation deleted successfully')
    })
  })
})
