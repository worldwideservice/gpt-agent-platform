import { NextRequest, NextResponse } from 'next/server'
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
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.SUPABASE_URL!
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const client = createClient(supabaseUrl, supabaseKey)

      const { nanoid } = await import('nanoid')

      // Create organization
      const baseSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `org-${nanoid(6).toLowerCase()}`
      let slugCandidate = baseSlug
      let slugIsUnique = false

      while (!slugIsUnique) {
        const { data } = await client
          .from('organizations')
          .select('id')
          .eq('slug', slugCandidate)
          .maybeSingle()

        if (data) {
          slugCandidate = `${baseSlug}-${nanoid(4)}`
        } else {
          slugIsUnique = true
        }
      }

      const { data: organization } = await client
        .from('organizations')
        .insert({
          name: `${firstName} ${lastName}`,
          slug: slugCandidate
        })
        .select()
        .single()

      if (organization) {
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
      }
    } catch (orgError) {
      console.warn('Failed to create organization:', orgError)
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
    console.error('Registration error:', error)

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
