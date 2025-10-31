import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { UserRepository } from '@/lib/repositories/users'

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const user = await UserRepository.findUserById(session.user.id)

    if (!user) {
      return NextResponse.json({ success: false, error: 'Пользователь не найден' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        locale: user.locale,
      },
    })
  } catch (error) {
    console.error('Account API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить данные аккаунта',
      },
      { status: 500 },
    )
  }
}

const updateAccountSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  locale: z.string().optional(),
})

export const PATCH = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = updateAccountSchema.safeParse(body)

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

    const user = await UserRepository.updateUser(session.user.id, parsed.data)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        locale: user.locale,
      },
    })
  } catch (error) {
    console.error('Account update API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить данные аккаунта',
      },
      { status: 500 },
    )
  }
}



