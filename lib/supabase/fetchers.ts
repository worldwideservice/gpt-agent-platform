import { cache } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/supabase'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export type SupabaseServerFetcher<Args extends unknown[], Result> = (
  client: SupabaseClient<Database>,
  ...args: Args
) => Promise<Result>

export function createSupabaseServerFetcher<Args extends unknown[], Result>(
  fetcher: SupabaseServerFetcher<Args, Result>,
) {
  const cached = cache(async (...args: Args) => {
    const client = getSupabaseServerClient()
    return fetcher(client, ...args)
  })

  return cached
}
