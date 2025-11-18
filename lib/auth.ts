/**
 * Auth configuration re-export
 * This file re-exports auth configuration from the root auth.ts file
 * to maintain compatibility with existing imports
 */

// Re-export from root auth file
export { auth, signIn, signOut, handlers } from '@/auth'

// For compatibility with files that import authOptions
// Note: Next-Auth v5 doesn't use authOptions anymore
// If needed, import auth function directly
export const authOptions = {
  // This is a placeholder for backward compatibility
  // In Next-Auth v5, use the auth() function directly instead
}
