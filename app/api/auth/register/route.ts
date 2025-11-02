import { NextRequest, NextResponse } from 'next/server'
import { UserRepository } from '@/lib/repositories/users'
import { createNotification } from '@/lib/repositories/notifications'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { loadSupabaseServerEnv } from '@/lib/env/supabase'

// API routes should always be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    loadSupabaseServerEnv()

    const { email, password, firstName, lastName } = await request.json()

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный email адрес' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await UserRepository.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }

    // Create user
    let user
    try {
      user = await UserRepository.createUser({
        email,
        password,
        firstName,
        lastName,
      })

      if (!user) {
        console.error('Registration: createUser returned null')
        return NextResponse.json(
          { error: 'Не удалось создать пользователя' },
          { status: 500 }
        )
      }
    } catch (createError) {
      console.error('Registration: Error in createUser:', createError)
      const errorMessage = createError instanceof Error ? createError.message : 'Неизвестная ошибка при создании пользователя'
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    let organizationId: string | null = null

    // Create organization for the user
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Registration: Creating organization for user:', user.id)
      }

      // Use validated Supabase client
      const client = getSupabaseServiceRoleClient()

      const baseSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `org-${Date.now()}`
      let slugCandidate = baseSlug
      let counter = 0

      // Simple slug uniqueness check
      while (counter < 10) {
        try {
          const { data: existing } = await client
            .from('organizations')
            .select('id')
            .eq('slug', slugCandidate)
            .single()

          if (existing) {
            slugCandidate = `${baseSlug}-${counter + 1}`
            counter++
          } else {
            break
          }
        } catch (error) {
          // If no existing org found, slug is unique
          break
        }
      }

      const { data: organization, error: orgError } = await client
        .from('organizations')
        .insert({
          name: `${firstName} ${lastName}`,
          slug: slugCandidate
        })
        .select()
        .single()

      if (organization && !orgError) {
        organizationId = organization.id

        // Update user's default organization
        const { error: updateError } = await client
          .from('users')
          .update({ default_org_id: organization.id })
          .eq('id', user.id)

        if (updateError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Registration: Failed to update user default organization:', updateError)
          }
        }

        // Add user to organization
        const { error: memberError } = await client
          .from('organization_members')
          .insert({
            org_id: organization.id,
            user_id: user.id,
            role: 'owner'
          })

        if (memberError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Registration: Failed to add user to organization:', memberError)
          }
        }

        // Create welcome notification
        if (organizationId) {
          try {
            await createNotification(organizationId, {
              userId: user.id,
              type: 'success',
              title: 'Добро пожаловать! 🎉',
              message: `Ваш аккаунт успешно создан. Ваша организация "${organization.name}" готова к работе.`,
              linkUrl: '/agents',
              linkText: 'Создать первого агента',
              metadata: {
                event: 'user_registered',
                userId: user.id,
                organizationId: organization.id,
              },
            })
          } catch (notifError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to create welcome notification:', notifError)
            }
            // Don't fail registration if notification fails
          }
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Registration: Organization created successfully:', organization.id)
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Registration: Failed to create organization:', orgError)
        }
      }
    } catch (orgError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration: Organization creation failed:', orgError)
      }
      // Continue anyway - user is created
    }

    return NextResponse.json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
      organizationId,
    })
  } catch (error) {
    // Логируем ошибки в production тоже для диагностики
    console.error('Registration error:', error)
    if (error instanceof Error) {
      console.error('Registration error details:', {
        message: error.message,
        stack: error.stack,
      })
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
