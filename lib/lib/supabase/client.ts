'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import { loadSupabaseClientEnv } from '@/lib/env/supabase'

import type { Database } from '@/types/supabase'

let supabaseBrowserClient: SupabaseClient<Database> | undefined

export const getSupabaseBrowserClient = (): SupabaseClient<Database> => {
 if (supabaseBrowserClient) {
 return supabaseBrowserClient
 }

 const env = loadSupabaseClientEnv()

 supabaseBrowserClient = createBrowserClient<Database>(
 env.NEXT_PUBLIC_SUPABASE_URL,
 env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 )

 return supabaseBrowserClient
}

// Export supabase for backward compatibility
export const supabase = getSupabaseBrowserClient()



