import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { updateProfileSchema } from '@/lib/validation/schemas/account-settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/profile
 * Получение профиля текущего пользователя
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // [MOCK] В реальном проекте - запрос к БД
    // const { data: user } = await supabase
    //   .from('users')
    //   .select('id, email, first_name, last_name, avatar_url, created_at')
    //   .eq('id', session.user.id)
    //   .single()

    const mockUser = {
      id: session.user.id,
      email: session.user.email || 'admin@example.com',
      firstName: session.user.name?.split(' ')[0] || 'Admin',
      lastName: session.user.name?.split(' ')[1] || 'User',
      avatarUrl: session.user.image || null,
      createdAt: new Date('2024-01-01').toISOString(),
    }

    return NextResponse.json(mockUser)
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}

/**
 * PUT /api/user/profile
 * Обновление профиля пользователя
 */
export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = updateProfileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email } = validation.data

    // [MOCK] В реальном проекте - обновление в БД
    // await supabase
    //   .from('users')
    //   .update({
    //     first_name: firstName,
    //     last_name: lastName,
    //     email,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', session.user.id)

    // eslint-disable-next-line no-console
    console.log(`[MOCK] Profile updated for user ${session.user.id}:`, { firstName, lastName, email })

    return NextResponse.json({
      id: session.user.id,
      firstName,
      lastName,
      email,
      message: 'Profile updated successfully',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
