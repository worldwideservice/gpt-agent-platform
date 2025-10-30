import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import {
  generateDashboardStats,
  generateAnalyticsReport,
  getAnalyticsReports,
  exportAnalyticsData,
} from '@/lib/services/analytics'

const generateReportSchema = z.object({
  report_type: z.enum(['usage', 'performance', 'engagement', 'revenue']),
  start_date: z.string(),
  end_date: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
})

const exportDataSchema = z.object({
  export_type: z.enum(['csv', 'json', 'pdf']),
  data: z.record(z.string(), z.any()),
})

/**
 * GET /api/analytics - Получение данных аналитики
 */
export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const reportType = searchParams.get('report_type') as any

    switch (action) {
      case 'dashboard_stats': {
        if (!startDate || !endDate) {
          return NextResponse.json(
            { success: false, error: 'Требуются параметры start_date и end_date' },
            { status: 400 },
          )
        }

        const stats = await generateDashboardStats(
          session.user.orgId,
          new Date(startDate),
          new Date(endDate),
        )

        return NextResponse.json({ success: true, data: stats })
      }

      case 'reports': {
        const limit = parseInt(searchParams.get('limit') || '50')
        const reports = await getAnalyticsReports(session.user.orgId, reportType, limit)

        return NextResponse.json({ success: true, data: reports })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Неизвестное действие' },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error('Analytics GET API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось получить данные аналитики',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/analytics - Генерация отчетов и экспорт данных
 */
export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'generate_report': {
        const parsed = generateReportSchema.safeParse(body)

        if (!parsed.success) {
          const issues = parsed.error.issues.map((issue) => issue.message)
          return NextResponse.json(
            {
              success: false,
              error: 'Некорректные данные',
              details: issues,
            },
            { status: 400 },
          )
        }

        const report = await generateAnalyticsReport(
          session.user.orgId,
          parsed.data.report_type,
          new Date(parsed.data.start_date),
          new Date(parsed.data.end_date),
          parsed.data.title,
          parsed.data.description,
        )

        if (!report) {
          return NextResponse.json(
            { success: false, error: 'Не удалось сгенерировать отчет' },
            { status: 500 },
          )
        }

        return NextResponse.json({ success: true, data: report })
      }

      case 'export_data': {
        const parsed = exportDataSchema.safeParse(body)

        if (!parsed.success) {
          const issues = parsed.error.issues.map((issue) => issue.message)
          return NextResponse.json(
            {
              success: false,
              error: 'Некорректные данные',
              details: issues,
            },
            { status: 400 },
          )
        }

        const exportedData = await exportAnalyticsData(
          session.user.orgId,
          parsed.data.export_type,
          parsed.data.data,
        )

        if (!exportedData) {
          return NextResponse.json(
            { success: false, error: 'Не удалось экспортировать данные' },
            { status: 500 },
          )
        }

        const contentType = parsed.data.export_type === 'json' ? 'application/json' : 'text/csv'
        const filename = `analytics-export-${new Date().toISOString().split('T')[0]}.${parsed.data.export_type}`

        return new NextResponse(exportedData, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Неизвестное действие' },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error('Analytics POST API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось выполнить операцию аналитики',
      },
      { status: 500 },
    )
  }
}


