import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const toSafeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export const authConfig = {
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = toSafeString(credentials?.email).toLowerCase()
        const password = toSafeString(credentials?.password)

        if (!email || !password) {
          return null
        }

        try {
          // Проверка авторизации через таблицу users (так как регистрация создает пользователя там)
          const { UserRepository } = await import('@/lib/repositories/users')
          const { compare } = await import('bcryptjs')
          
          const user = await UserRepository.findUserByEmail(email)
          
          if (!user || !user.password_hash) {
            return null
          }

          // Проверяем пароль
          const isPasswordValid = await compare(password, user.password_hash)
          
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name || user.email?.split('@')[0] || 'User',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
