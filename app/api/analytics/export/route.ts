import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { generateDashboardStats } from '@/lib/services/analytics'
import { createErrorResponse } from '@/lib/utils/error-handler'

const querySchema = z.object({
  range: z.enum(['7d', '30d', '90d', '1y']).optional().default('7d'),
})

/**
 * GET /api/analytics/export - Экспорт аналитики в CSV
 */
export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      range: searchParams.get('range') || '7d',
    })

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      const { response, status } = createErrorResponse(
        new Error('Validation failed'),
        {
          code: 'VALIDATION_ERROR',
          details: issues,
          logToSentry: false,
        }
      )
      return NextResponse.json(response, { status })
    }

    // Вычисляем даты на основе диапазона
    const endDate = new Date()
    const startDate = new Date()

    switch (parsed.data.range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    const stats = await generateDashboardStats(
      session.user.orgId,
      startDate,
      endDate
    )

    // Формируем CSV
    const csvRows: string[] = []
    
    // Заголовки
    csvRows.push('Метрика,Значение')
    
    // Основные метрики
    csvRows.push(`Всего агентов,${stats.totalAgents}`)
    csvRows.push(`Активных агентов,${stats.activeAgents}`)
    csvRows.push(`Всего разговоров,${stats.totalConversations}`)
    csvRows.push(`Всего сообщений,${stats.totalMessages}`)
    csvRows.push(`Использовано токенов,${stats.totalTokensUsed}`)
    csvRows.push(`Среднее время ответа,${stats.averageResponseTime.toFixed(2)}`)
    csvRows.push(`Процент успеха,${stats.successRate.toFixed(2)}%`)
    
    // Метрики производительности
    csvRows.push('')
    csvRows.push('Метрики производительности,')
    csvRows.push(`Время первого ответа,${stats.performanceMetrics.averageFirstResponseTime.toFixed(2)}`)
    csvRows.push(`Время решения,${stats.performanceMetrics.averageResolutionTime.toFixed(2)}`)
    csvRows.push(`Удовлетворенность,${(stats.performanceMetrics.customerSatisfaction * 100).toFixed(2)}%`)
    csvRows.push(`Автоматизация,${(stats.performanceMetrics.automationRate * 100).toFixed(2)}%`)
    
    // Топ агентов
    csvRows.push('')
    csvRows.push('Топ агентов,')
    csvRows.push('Имя,Разговоры,Сообщения,Токены')
    stats.topPerformingAgents.forEach((agent) => {
      csvRows.push(`${agent.name},${agent.conversationsCount},${agent.messagesCount},${agent.tokensUsed}`)
    })
    
    // Использование по периодам
    csvRows.push('')
    csvRows.push('Использование по периодам,')
    csvRows.push('Период,Разговоры,Сообщения,Токены')
    stats.usageByPeriod.forEach((period) => {
      csvRows.push(`${period.period},${period.conversations},${period.messages},${period.tokens}`)
    })

    const csv = csvRows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="analytics-${parsed.data.range}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'ANALYTICS_EXPORT_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}





