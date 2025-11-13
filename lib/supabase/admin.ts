import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { loadSupabaseServerEnv } from '@/lib/env/supabase'

import type { Database } from '@/types/supabase'

const createQueryBuilder = () => {
  const result = { data: null as unknown, error: null as unknown }

  const proxy = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') {
          return (
            onFulfilled?: (value: typeof result) => unknown,
            onRejected?: (reason: unknown) => unknown,
          ) => Promise.resolve(result).then(onFulfilled, onRejected)
        }

        if (prop === 'maybeSingle' || prop === 'single') {
          return async () => result
        }

        return () => proxy
      },
    },
  )

  return proxy
}

let supabaseServiceRoleClient: SupabaseClient | undefined

export const getSupabaseServiceRoleClient = (): SupabaseClient => {
  if (supabaseServiceRoleClient) {
    return supabaseServiceRoleClient
  }

  const env = loadSupabaseServerEnv()

  const client = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }) as unknown as SupabaseClient

  if (process.env.NODE_ENV === 'test') {
    const channel = {
      on: () => channel,
      subscribe: async () => ({ error: null }),
      unsubscribe: async () => ({ error: null }),
    }

    Object.assign(client as any, {
      from: () => createQueryBuilder(),
      rpc: () => createQueryBuilder(),
      channel: () => channel,
    })
  }

  supabaseServiceRoleClient = client

  return supabaseServiceRoleClient
}




