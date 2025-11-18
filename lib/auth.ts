/**
 * Auth configuration re-export
 * This file re-exports auth configuration from the root auth.ts file
 * to maintain compatibility with existing imports
 */

import type { Session } from 'next-auth'

// Re-export from root auth file
export { auth, signIn, signOut, handlers } from '@/auth'

// For compatibility with files that import authOptions
// Note: Next-Auth v5 doesn't use authOptions anymore
// If needed, import auth function directly
export const authOptions = {
  // This is a placeholder for backward compatibility
  // In Next-Auth v5, use the auth() function directly instead
}

/**
 * NextAuth v5 compatibility wrapper for getServerSession
 * This function wraps the auth() function to maintain compatibility
 * with code that uses the old getServerSession(authOptions) pattern
 *
 * @param _authOptions - Ignored, kept for API compatibility
 * @returns Session or null
 */
export async function getServerSession(_authOptions?: typeof authOptions): Promise<Session | null> {
  const { auth } = await import('@/auth')
  return auth()
}
