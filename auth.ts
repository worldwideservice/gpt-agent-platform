import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { createOrganizationWithOwner, getOrganizationsForUser, setDefaultOrganizationForUser } from '@/lib/repositories/organizations'
import { UserRepository } from '@/lib/repositories/users'

interface AuthenticatedUser {
  id: string
  email: string
  name: string
  orgId: string
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: 'jwt',
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
        const rawEmail = typeof credentials?.email === 'string' ? credentials.email : null
        const rawPassword = typeof credentials?.password === 'string' ? credentials.password : null

        const email = rawEmail?.toLowerCase().trim()
        const password = rawPassword?.trim()

        // Специальная обработка для E2E тестирования
        if (process.env.E2E_ONBOARDING_FAKE === '1') {
          const fallbackOrgId = process.env.SUPABASE_DEFAULT_ORGANIZATION_ID || '550e8400-e29b-41d4-a716-446655440000'

          return {
            id: '00000000-0000-4000-8000-0000000000ff',
            email: email || 'test@example.com',
            name: 'Demo Test User',
            orgId: fallbackOrgId,
          }
        }

        if (!email || !password) {
          return null
        }

        const createDemoUser = () => {
          const fallbackOrgId = process.env.SUPABASE_DEFAULT_ORGANIZATION_ID

          if (!fallbackOrgId) {
            throw new Error('SUPABASE_DEFAULT_ORGANIZATION_ID is required for demo login')
          }

          const demoUser: AuthenticatedUser = {
            id: '00000000-0000-4000-8000-0000000000ff',
            email,
            name: 'Demo Founder',
            orgId: fallbackOrgId,
          }

          return demoUser
        }

        let user: Awaited<ReturnType<typeof UserRepository.findUserByEmail>> | null = null

        try {
          user = await UserRepository.findUserByEmail(email)
        } catch (error) {
          if (process.env.NODE_ENV !== 'production' && email === 'founder@example.com' && password === 'Demo1234!') {
            return createDemoUser()
          }

          throw error
        }

        if (!user || !user.password_hash) {
          if (
            process.env.NODE_ENV !== 'production' &&
            email === 'founder@example.com' &&
            password === 'Demo1234!'
          ) {
            return createDemoUser()
          }

          return null
        }

        const passwordMatch = await compare(password, user.password_hash ?? '')

        if (!passwordMatch) {
          return null
        }

        await UserRepository.updateUserLastSignIn(user.id)

        let defaultOrgId = user.default_org_id ?? undefined

        if (!defaultOrgId) {
          const memberships = await getOrganizationsForUser(user.id)

          if (memberships.length > 0) {
            const membershipOrgId = memberships[0].id
            defaultOrgId = membershipOrgId
            await setDefaultOrganizationForUser(user.id, membershipOrgId)
          } else {
            const organization = await createOrganizationWithOwner({
              name: user.full_name ?? user.email.split('@')[0] ?? 'Организация',
              ownerId: user.id,
            })

            defaultOrgId = organization.id
          }
        }

        if (!defaultOrgId) {
          throw new Error('Unable to determine organization for user')
        }

        const authenticatedUser: AuthenticatedUser = {
          id: user.id,
          email: user.email,
          name: user.full_name ?? user.email,
          orgId: defaultOrgId,
        }

        return authenticatedUser
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authenticated = user as AuthenticatedUser
        token.orgId = authenticated.orgId
        token.name = authenticated.name
        token.email = authenticated.email
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.email = (token.email as string | undefined) ?? session.user.email
        session.user.name = (token.name as string | undefined) ?? session.user.name
        if (typeof token.orgId === 'string') {
          session.user.orgId = token.orgId
        }
      }

      return session
    },
  },
})
