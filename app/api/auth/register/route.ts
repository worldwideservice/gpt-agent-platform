import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UserRepository } from '@/lib/repositories/users'

// Force Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
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

    // Create user
    const user = await UserRepository.createUser({
      email,
      password,
      firstName,
      lastName,
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Не удалось создать пользователя' },
        { status: 500 }
      )
    }

    // Create organization for the user
    try {
      console.log('Registration: Creating organization for user:', user.id)

      // Simple organization creation - just insert into organizations table
      const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
        // Update user's default organization
        await client
          .from('users')
          .update({ default_org_id: organization.id })
          .eq('id', user.id)

        // Add user to organization
        await client
          .from('organization_members')
          .insert({
            org_id: organization.id,
            user_id: user.id,
            role: 'owner'
          })

        console.log('Registration: Organization created successfully:', organization.id)
      } else {
        console.error('Registration: Failed to create organization:', orgError)
      }
    } catch (orgError) {
      console.error('Registration: Organization creation failed:', orgError)
      // Continue anyway - user is created
    }

    return NextResponse.json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Registration error:', error)
    }

    if (error instanceof Error) {
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
