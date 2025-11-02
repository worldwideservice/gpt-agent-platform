import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { UserRepository } from '@/lib/repositories/users'

export async function GET() {
  try {
    const email = 'admin@worldwideservice.eu'
    const password = 'l1tmw6u977c9!Q'
    
    console.log('[test-auth] Looking for user:', email)
    const user = await UserRepository.findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email
      })
    }
    
    console.log('[test-auth] User found:', user.id)
    console.log('[test-auth] Has password hash:', !!user.password_hash)
    
    if (!user.password_hash) {
      return NextResponse.json({
        success: false,
        error: 'No password hash',
        userId: user.id
      })
    }
    
    console.log('[test-auth] Comparing password...')
    const passwordMatch = await compare(password, user.password_hash)
    
    return NextResponse.json({
      success: true,
      userFound: true,
      hasPassword: !!user.password_hash,
      passwordMatch,
      userId: user.id,
      email: user.email
    })
  } catch (error) {
    console.error('[test-auth] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

