import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  recordMetric,
  getMetrics,
  generateDashboardStats,
  generateAnalyticsReport,
  getAnalyticsReports,
  exportAnalyticsData,
} from '@/lib/services/analytics'

// Мокаем Supabase
const createMockQuery = (result?: { data: any; error: any }) => {
  const query: any = {
    from: vi.fn(() => query),
    select: vi.fn(() => query),
    insert: vi.fn(() => query),
    eq: vi.fn(() => query),
    in: vi.fn(() => query),
    gte: vi.fn(() => query),
    lte: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  }
  
  // Делаем query thenable для поддержки .then()
  query.then = vi.fn((resolve) => {
    const resolvedResult = result || { data: [], error: null }
    return Promise.resolve(resolvedResult).then(resolve)
  })
  
  // Поддержка async/await
  query.catch = vi.fn((reject) => {
    return Promise.resolve(result || { data: [], error: null }).catch(reject)
  })
  
  return query
}

const mockSupabaseClient = createMockQuery()
// Добавляем метод rpc для Supabase
mockSupabaseClient.rpc = vi.fn().mockResolvedValue({ data: [], error: null })

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))

// Вспомогательные функции не экспортируются, поэтому мокаем их через динамический импорт
// Но для тестов мы можем просто мокать getMetrics

describe('Analytics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('recordMetric', () => {
    it('should record metric successfully', async () => {
      const insertQuery = createMockQuery({ data: { id: 'metric-123' }, error: null })
      insertQuery.insert.mockReturnValue(insertQuery)

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await recordMetric('org-123', 'test_metric', 100, { key: 'value' }, { meta: 'data' })

      expect(result).toBe(true)
      expect(insertQuery.insert).toHaveBeenCalledWith({
        org_id: 'org-123',
        metric_type: 'test_metric',
        value: 100,
        dimensions: { key: 'value' },
        metadata: { meta: 'data' },
      })
    })

    it('should return false on error', async () => {
      const insertQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      insertQuery.insert.mockReturnValue(insertQuery)

      mockSupabaseClient.from.mockReturnValue(insertQuery)

      const result = await recordMetric('org-123', 'test_metric', 100)

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Connection error')
      })

      const result = await recordMetric('org-123', 'test_metric', 100)

      expect(result).toBe(false)
    })
  })

  describe('getMetrics', () => {
    it('should get metrics for date range', async () => {
      const mockMetrics = [
        {
          id: '1',
          org_id: 'org-123',
          metric_type: 'test_metric',
          value: 100,
          dimensions: {},
          timestamp: '2025-01-26T00:00:00Z',
          metadata: {},
        },
      ]

      const queryChain = createMockQuery({ data: mockMetrics, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const result = await getMetrics('org-123', ['test_metric'], startDate, endDate)

      expect(result).toHaveLength(1)
      expect(result[0].metric_type).toBe('test_metric')
    })

    it('should filter by dimensions', async () => {
      const queryChain = createMockQuery({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      await getMetrics('org-123', ['test_metric'], startDate, endDate, { key: 'value' })

      expect(queryChain.eq).toHaveBeenCalled()
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery()
      queryChain.order.mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const result = await getMetrics('org-123', ['test_metric'], startDate, endDate)

      expect(result).toEqual([])
    })
  })

  describe('generateDashboardStats', () => {
    it('should generate dashboard stats', async () => {
      const agentsQuery = createMockQuery({
        data: [
          { id: 'agent-1', name: 'Agent 1', is_active: true },
          { id: 'agent-2', name: 'Agent 2', is_active: false },
        ],
        error: null,
      })

      const conversationsQuery = createMockQuery({ data: [], error: null })
      const messagesQuery = createMockQuery({ data: [], error: null })
      const tokensQuery = createMockQuery({ data: [], error: null })
      const usageByPeriodQuery = createMockQuery({ data: [], error: null })
      const channelBreakdownQuery = createMockQuery({ data: [], error: null })

      // Мокаем rpc для getTopPerformingAgents, getUsageByPeriod, getChannelBreakdown
      mockSupabaseClient.rpc = vi.fn()
        .mockResolvedValueOnce({ data: [], error: null }) // getTopPerformingAgents
        .mockResolvedValueOnce({ data: [], error: null }) // getUsageByPeriod
        .mockResolvedValueOnce({ data: [], error: null }) // getChannelBreakdown

      mockSupabaseClient.from
        .mockReturnValueOnce(agentsQuery) // agents
        .mockReturnValueOnce(conversationsQuery) // conversations
        .mockReturnValueOnce(messagesQuery) // messages
        .mockReturnValueOnce(tokensQuery) // tokens
        .mockReturnValueOnce(usageByPeriodQuery) // usage by period
        .mockReturnValueOnce(channelBreakdownQuery) // channel breakdown

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const result = await generateDashboardStats('org-123', startDate, endDate)

      expect(result.totalAgents).toBe(2)
      expect(result.activeAgents).toBe(1)
      expect(result.totalConversations).toBe(0)
    })

    it('should handle errors gracefully', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database error')
      })

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')

      await expect(generateDashboardStats('org-123', startDate, endDate)).rejects.toThrow()
    })
  })

  describe('generateAnalyticsReport', () => {
    it('should generate usage report', async () => {
      // generateUsageReport вызывает generateDashboardStats, который делает много запросов
      // Мокаем все запросы для generateDashboardStats
      const agentsQuery = createMockQuery({
        data: [
          { id: 'agent-1', name: 'Agent 1', is_active: true },
        ],
        error: null,
      })
      const conversationsQuery = createMockQuery({ data: [], error: null })
      const messagesQuery = createMockQuery({ data: [], error: null })
      const tokensQuery = createMockQuery({ data: [], error: null })
      const usageByPeriodQuery = createMockQuery({ data: [], error: null })
      const channelBreakdownQuery = createMockQuery({ data: [], error: null })

      // Мокаем rpc для getTopPerformingAgents, getUsageByPeriod, getChannelBreakdown
      mockSupabaseClient.rpc = vi.fn()
        .mockResolvedValueOnce({ data: [], error: null }) // getTopPerformingAgents
        .mockResolvedValueOnce({ data: [], error: null }) // getUsageByPeriod
        .mockResolvedValueOnce({ data: [], error: null }) // getChannelBreakdown
      
      const insertQuery = createMockQuery({ data: { id: 'report-123' }, error: null })
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single = vi.fn().mockResolvedValue({ 
        data: { 
          id: 'report-123',
        }, 
        error: null 
      })
      
      // Мокаем возврат полного объекта отчета после insert
      insertQuery.select.mockImplementation(() => {
        const selectQuery = createMockQuery({ 
          data: { 
            id: 'report-123',
            report_type: 'usage',
            org_id: 'org-123',
            title: 'Usage Report',
            date_range: { start: '2025-01-01', end: '2025-01-31' },
            data: {},
            generated_at: new Date().toISOString(),
            metadata: {},
          }, 
          error: null 
        })
        selectQuery.single = vi.fn().mockResolvedValue({ 
          data: { 
            id: 'report-123',
            report_type: 'usage',
            org_id: 'org-123',
            title: 'Usage Report',
            date_range: { start: '2025-01-01', end: '2025-01-31' },
            data: {},
            generated_at: new Date().toISOString(),
            metadata: {},
          }, 
          error: null 
        })
        return selectQuery
      })

      // Мокаем все вызовы: сначала для generateDashboardStats (внутри generateUsageReport), потом для insert
      mockSupabaseClient.from
        .mockReturnValueOnce(agentsQuery) // agents
        .mockReturnValueOnce(conversationsQuery) // conversations
        .mockReturnValueOnce(messagesQuery) // messages
        .mockReturnValueOnce(tokensQuery) // tokens
        .mockReturnValueOnce(usageByPeriodQuery) // usage by period
        .mockReturnValueOnce(channelBreakdownQuery) // channel breakdown
        .mockReturnValueOnce(insertQuery) // для insert report

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const result = await generateAnalyticsReport('org-123', 'usage', startDate, endDate)

      expect(result).toBeDefined()
      expect(result?.report_type).toBe('usage')
    })

    it('should return null on error', async () => {
      const usageReportQuery = createMockQuery({ data: [], error: null })
      
      const insertQuery = createMockQuery({ data: null, error: { message: 'Database error' } })
      insertQuery.insert.mockReturnValue(insertQuery)
      insertQuery.select.mockReturnValue(insertQuery)
      insertQuery.single = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from
        .mockReturnValueOnce(usageReportQuery) // для generateUsageReport
        .mockReturnValueOnce(insertQuery) // для insert report

      const startDate = new Date('2025-01-01')
      const endDate = new Date('2025-01-31')
      const result = await generateAnalyticsReport('org-123', 'usage', startDate, endDate)

      expect(result).toBeNull()
    })
  })

  describe('getAnalyticsReports', () => {
    it('should get analytics reports', async () => {
      const mockReports = [
        {
          id: 'report-1',
          org_id: 'org-123',
          report_type: 'usage',
          title: 'Usage Report',
          date_range: { start: '2025-01-01', end: '2025-01-31' },
          data: {},
          generated_at: '2025-01-26T00:00:00Z',
          metadata: {},
        },
      ]

      const queryChain = createMockQuery({ data: mockReports, error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAnalyticsReports('org-123')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('report-1')
    })

    it('should filter by report type', async () => {
      const queryChain = createMockQuery({ data: [], error: null })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      await getAnalyticsReports('org-123', 'usage')

      expect(queryChain.eq).toHaveBeenCalledWith('report_type', 'usage')
    })

    it('should return empty array on error', async () => {
      const queryChain = createMockQuery({ data: null, error: { message: 'Database error' } })

      mockSupabaseClient.from.mockReturnValue(queryChain)

      const result = await getAnalyticsReports('org-123')

      expect(result).toEqual([])
    })
  })

  describe('exportAnalyticsData', () => {
    it('should export analytics data as JSON', async () => {
      const testData = { key: 'value', number: 123 }
      const result = await exportAnalyticsData('org-123', 'json', testData)

      expect(result).toBeDefined()
      expect(result).toContain('key')
      expect(result).toContain('value')
      expect(JSON.parse(result!)).toEqual(testData)
    })

    it('should export analytics data as CSV', async () => {
      const testData = { key: 'value', number: 123 }
      const result = await exportAnalyticsData('org-123', 'csv', testData)

      expect(result).toBeDefined()
      expect(result).toContain('key')
      expect(result).toContain('value')
    })

    it('should return null for PDF (not implemented)', async () => {
      const testData = { key: 'value' }
      const result = await exportAnalyticsData('org-123', 'pdf', testData)

      expect(result).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      // Передаем объект с циклической ссылкой для теста ошибки
      // Но используем JSON.stringify с replacer для избежания ошибки в тесте
      const circularData: any = { key: 'value' }
      circularData.self = circularData

      // Функция должна обработать это и вернуть null
      const result = await exportAnalyticsData('org-123', 'json', circularData)

      expect(result).toBeNull()
    })
  })
})

