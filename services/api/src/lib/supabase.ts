import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './types'

let cachedClient: SupabaseClient<Database> | undefined

export const getSupabaseClient = (url: string, serviceRoleKey: string) => {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedClient
}
