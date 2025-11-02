import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const DEFAULT_EMAIL = process.env.AUTH_DEFAULT_EMAIL?.trim().toLowerCase() || 'demo@example.com'
const DEFAULT_PASSWORD = process.env.AUTH_DEFAULT_PASSWORD ?? 'Demo1234!'
const DEFAULT_USER_NAME = process.env.AUTH_DEFAULT_NAME ?? 'Demo User'

const toSafeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export const authConfig = {
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
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

        if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
          return {
            id: '00000000-0000-4000-8000-000000000001',
            email,
            name: DEFAULT_USER_NAME,
          }
        }

        return null
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
