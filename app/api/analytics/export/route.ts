import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { generateDashboardStats, generateAnalyticsReport, exportAnalyticsData } from '@/lib/services/analytics'
import { createErrorResponse } from '@/lib/utils/error-handler'

const querySchema = z.object({
  range: z.enum(['7d', '30d', '90d', '1y']).optional().default('7d'),
  format: z.enum(['csv', 'json', 'pdf']).optional().default('csv'),
  reportType: z.enum(['usage', 'performance', 'engagement', 'revenue']).optional(),
})

/**
 * GET /api/analytics/export - Экспорт данных аналитики
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
      format: searchParams.get('format') || 'csv',
      reportType: searchParams.get('reportType') || undefined,
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

    // Получаем данные аналитики
    const stats = await generateDashboardStats(
      session.user.orgId,
      startDate,
      endDate
    )

    // Если указан тип отчёта, генерируем детальный отчёт
    let exportData = stats
    if (parsed.data.reportType) {
      const report = await generateAnalyticsReport(
        session.user.orgId,
        parsed.data.reportType,
        startDate,
        endDate
      )
      if (report) {
        exportData = report.data as Record<string, any>
      }
    }

    // Экспортируем данные
    const exported = await exportAnalyticsData(
      session.user.orgId,
      parsed.data.format,
      exportData
    )

    if (!exported) {
      const { response, status } = createErrorResponse(
        new Error('Failed to export data'),
        { code: 'EXPORT_ERROR', logToSentry: false }
      )
      return NextResponse.json(response, { status })
    }

    // Определяем Content-Type и имя файла
    let contentType = 'text/csv'
    let filename = `analytics-${parsed.data.range}-${new Date().toISOString().split('T')[0]}.csv`

    if (parsed.data.format === 'json') {
      contentType = 'application/json'
      filename = filename.replace('.csv', '.json')
    } else if (parsed.data.format === 'pdf') {
      contentType = 'application/pdf'
      filename = filename.replace('.csv', '.pdf')
    }

    // Возвращаем файл
    return new NextResponse(exported, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
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





