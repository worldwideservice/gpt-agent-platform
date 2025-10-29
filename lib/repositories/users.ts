import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { UserRow } from '@/types/supabase'

export const findUserByEmail = async (email: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle<UserRow>()

  if (error) {
    throw error
  }

  return data ?? null
}

export const findUserById = async (userId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle<UserRow>()

  if (error) {
    throw error
  }

  return data ?? null
}

export const updateUserLastSignIn = async (userId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  await supabase
    .from('users')
    .update({ last_sign_in_at: new Date().toISOString() })
    .eq('id', userId)
}

export const updateUserPasswordHash = async (userId: string, passwordHash: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', userId)

  if (error) {
    throw error
  }
}
