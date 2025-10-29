import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { createOrganizationWithOwner, getOrganizationsForUser, setDefaultOrganizationForUser } from '@/lib/repositories/organizations'
import { findUserByEmail, updateUserLastSignIn } from '@/lib/repositories/users'

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
        const email = credentials?.email?.toLowerCase().trim()
        const password = credentials?.password

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

        let user: Awaited<ReturnType<typeof findUserByEmail>> | null = null

        try {
          user = await findUserByEmail(email)
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

        const passwordMatch = await compare(password, user.password_hash)

        if (!passwordMatch) {
          return null
        }

        await updateUserLastSignIn(user.id)

        let defaultOrgId = user.default_org_id ?? undefined

        if (!defaultOrgId) {
          const memberships = await getOrganizationsForUser(user.id)

          if (memberships.length > 0) {
            defaultOrgId = memberships[0].id
            await setDefaultOrganizationForUser(user.id, defaultOrgId)
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
        session.user.orgId = token.orgId as string | undefined
      }

      return session
    },
  },
})

