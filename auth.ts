/* eslint-disable no-console */
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { createOrganizationWithOwner, getOrganizationsForUser, setDefaultOrganizationForUser } from '@/lib/repositories/organizations'
import { UserRepository } from '@/lib/repositories/users'
import type { DatabaseUser } from '@/types/user'

interface AuthenticatedUser {
 id: string
 email: string
 name: string
 orgId: string
 organizationSlug: string
}

export const {
 handlers,
 auth,
 signIn,
 signOut,
} = NextAuth({
 session: {
 strategy: 'jwt',
 maxAge: 30 * 24 * 60 * 60, // 30 дней по умолчанию (будет переопределено для rememberMe)
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
 const authPromise = async () => {
 try {
 const rawEmail = typeof credentials?.email === 'string' ? credentials.email : null
 const rawPassword = typeof credentials?.password === 'string' ? credentials.password : null

 const email = rawEmail?.toLowerCase().trim()
 const password = rawPassword?.trim()

 if (!email || !password) {
 console.log('NextAuth: Missing email or password')
 return null
 }

 let user: DatabaseUser | null = null

 try {
 console.log('[NextAuth] Looking for user with email:', email)
 user = await Promise.race([
 UserRepository.findUserByEmail(email),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Database timeout')), 5000)
 )
 ])
 console.log('[NextAuth] User found:', !!user, user?.id, user?.email)
 if (!user) {
 console.log('[NextAuth] User not found in database')
 return null
 }
 } catch (error) {
 console.error('[NextAuth] Error finding user:', error)
 if (error instanceof Error) {
 console.error('[NextAuth] Error details:', error.message, error.stack)
 }
 // Если это таймаут или ошибка БД, возвращаем null вместо throw
 console.log('[NextAuth] Database error, returning null')
 return null
 }

 if (!user || !user.password_hash) {
 console.log('NextAuth: User not found or no password hash')
 return null
 }

 try {
 console.log('[NextAuth] Checking password for user:', user.id)
 console.log('[NextAuth] Has password_hash:', !!user.password_hash)
 if (!user.password_hash) {
 console.log('[NextAuth] User has no password_hash')
 return null
 }
 
 const passwordMatch = await Promise.race([
 compare(password, user.password_hash),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Password check timeout')), 3000)
 )
 ])
 console.log('[NextAuth] Password match result:', passwordMatch)

 if (!passwordMatch) {
 console.log('[NextAuth] Password does not match - returning null')
 return null
 }
 } catch (error) {
 console.error('[NextAuth] Password check error:', error)
 if (error instanceof Error) {
 console.error('[NextAuth] Password error details:', error.message)
 }
 return null
 }

 try {
 await Promise.race([
 UserRepository.updateUserLastSignIn(user.id),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Update signin timeout')), 2000)
 )
 ])
 } catch (error) {
 console.warn('NextAuth: Failed to update last signin:', error)
 // Продолжаем без обновления
 }

 let defaultOrgId = user.default_org_id ?? undefined
                let defaultOrgSlug: string | undefined

 if (!defaultOrgId) {
 try {
 console.log('NextAuth: Getting organizations for user:', user.id)
 const memberships = await Promise.race([
 getOrganizationsForUser(user.id),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Organizations timeout')), 3000)
 )
 ])

 if (memberships.length > 0) {
 const membershipOrgId = memberships[0].id
                  const membershipOrgSlug = memberships[0].slug
 defaultOrgId = membershipOrgId
                  defaultOrgSlug = membershipOrgSlug
 try {
 await Promise.race([
 setDefaultOrganizationForUser(user.id, membershipOrgId),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Set default org timeout')), 2000)
 )
 ])
 } catch (error) {
 console.warn('NextAuth: Failed to set default organization:', error)
 }
 } else {
 console.log('NextAuth: Creating organization for user:', user.id)
 const organization = await Promise.race([
 createOrganizationWithOwner({
 name: user.full_name ?? user.email.split('@')[0] ?? 'Организация',
 ownerId: user.id,
 }),
 new Promise<never>((_, reject) =>
 setTimeout(() => reject(new Error('Create organization timeout')), 5000)
 )
 ])

 defaultOrgId = organization.id
                  defaultOrgSlug = organization.slug
 }
 } catch (error) {
 console.error('NextAuth: Organization setup error:', error)
 return null
 }
 }

 if (!defaultOrgId) {
 console.error('NextAuth: Unable to determine organization for user')
 return null
 }

                // Fetch organization slug if not yet available
                if (!defaultOrgSlug) {
                  try {
                    const memberships = await getOrganizationsForUser(user.id)
                    const membership = memberships.find((m) => m.id === defaultOrgId)
                    defaultOrgSlug = membership?.slug
                  } catch (error) {
                    console.warn('NextAuth: Failed to get organization slug:', error)
                  }
                }

                if (!defaultOrgSlug) {
                  console.error('NextAuth: Unable to determine organization slug for user')
                  return null
                }

 const authenticatedUser: AuthenticatedUser = {
 id: user.id,
 email: user.email,
 name: user.full_name ?? user.email,
 orgId: defaultOrgId,
                  organizationSlug: defaultOrgSlug,
 }

 console.log('NextAuth: Authentication successful for user:', user.id)
 return authenticatedUser

 } catch (error) {
 console.error('NextAuth: Unexpected error in authorize:', error)
 return null
 }
 }

 // Оборачиваем всю аутентификацию в Promise.race с таймаутом
 try {
 return await Promise.race([
 authPromise(),
 new Promise<null>((_, reject) =>
 setTimeout(() => {
 console.error('[NextAuth] Authentication timeout after 30 seconds')
 reject(new Error('Authentication timeout'))
 }, 30000) // 30 секунд общий таймаут (увеличено)
 )
 ])
 } catch (error) {
 console.error('[NextAuth] Authentication timeout or error:', error)
 if (error instanceof Error) {
 console.error('[NextAuth] Error details:', error.message, error.stack)
 }
 return null
 }
 },
 }),
 ],
 callbacks: {
 async jwt({ token, user }) {
 if (user) {
 const authenticated = user as AuthenticatedUser
 token.orgId = authenticated.orgId
        token.organizationSlug = authenticated.organizationSlug
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
        if (typeof token.organizationSlug === 'string') {
          session.user.organizationSlug = token.organizationSlug
        }
 }

 return session
 },
 },
})
