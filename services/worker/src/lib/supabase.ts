import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from './types'

let client: SupabaseClient<Database> | null = null

export const getSupabaseClient = (url: string, serviceRoleKey: string) => {
  if (client) {
    return client
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return client
}
