import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { UserRepository } from '@/lib/repositories/users'
import type { User } from '@/types/user'

// API routes should always be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
        fullName: user.name || '',
        avatarUrl: user.image || null,
        locale: 'ru', // TODO: Add locale to User type if needed
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Account API error', error)
    }

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

    const updateData: Partial<User> = {}
    if (parsed.data.fullName !== undefined) {
      updateData.name = parsed.data.fullName
    }
    if (parsed.data.email !== undefined) {
      updateData.email = parsed.data.email
    }
    if (parsed.data.avatarUrl !== undefined) {
      updateData.image = parsed.data.avatarUrl || undefined
    }

    const updated = await UserRepository.updateUser(session.user.id, updateData)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch updated user
    const user = await UserRepository.getUserById(session.user.id)

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
        fullName: user.name || '',
        avatarUrl: user.image || null,
        locale: 'ru', // TODO: Add locale to User type if needed
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



