import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

const kommoSettingsSchema = z.object({
  domain: z.string().min(1, 'Домен обязателен'),
  client_id: z.string().min(1, 'Client ID обязателен'),
  client_secret: z.string().min(1, 'Client Secret обязателен'),
  access_token: z.string().min(1, 'Access Token обязателен'),
  refresh_token: z.string().optional(),
  redirect_uri: z.string().url('Неверный URL'),
})

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    const { data: settings, error } = await supabase
      .from('crm_settings')
      .select('*')
      .eq('org_id', session.user.orgId)
      .eq('crm_type', 'kommo')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch Kommo settings:', error)
      return NextResponse.json(
        { success: false, error: 'Не удалось получить настройки' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      settings: settings || null,
    })
  } catch (error) {
    console.error('Get Kommo settings API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    )
  }
}

export const POST = async (request: Request) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = kommoSettingsSchema.safeParse(body)

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

    const settings = {
      org_id: session.user.orgId,
      crm_type: 'kommo',
      config: parsed.data,
      created_by: session.user.id,
      updated_by: session.user.id,
    }

    const supabase = getSupabaseServiceRoleClient()

    // Удаляем существующие настройки
    await supabase
      .from('crm_settings')
      .delete()
      .eq('org_id', session.user.orgId)
      .eq('crm_type', 'kommo')

    // Создаем новые
    const { data, error } = await supabase
      .from('crm_settings')
      .insert(settings)
      .select()
      .single()

    if (error) {
      console.error('Failed to save Kommo settings:', error)
      return NextResponse.json(
        { success: false, error: 'Не удалось сохранить настройки' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      settings: data,
      message: 'Настройки Kommo сохранены успешно',
    })
  } catch (error) {
    console.error('Save Kommo settings API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    )
  }
}
