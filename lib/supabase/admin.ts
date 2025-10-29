import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { loadSupabaseServerEnv } from '@/lib/env/supabase'

import type { Database } from '@/types/supabase'

let supabaseServiceRoleClient: SupabaseClient | undefined

export const getSupabaseServiceRoleClient = (): SupabaseClient => {
  if (supabaseServiceRoleClient) {
    return supabaseServiceRoleClient
  }

  const env = loadSupabaseServerEnv()

  supabaseServiceRoleClient = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }) as unknown as SupabaseClient

  return supabaseServiceRoleClient
}




