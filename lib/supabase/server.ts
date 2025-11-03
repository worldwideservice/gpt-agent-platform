import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { loadSupabaseServerEnv } from '@/lib/env/supabase'

import type { Database } from '@/types/supabase'

let supabaseServerClient: SupabaseClient<Database> | undefined

export const getSupabaseServerClient = (): SupabaseClient<Database> => {
 if (supabaseServerClient) {
 return supabaseServerClient
 }

 const env = loadSupabaseServerEnv()

 supabaseServerClient = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
 auth: {
 persistSession: false,
 autoRefreshToken: false,
 },
 })

 return supabaseServerClient
}






