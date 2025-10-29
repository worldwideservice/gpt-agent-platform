import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { UserRow } from '@/types/supabase'

export const findUserByEmail = async (email: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as UserRow | null) ?? null
}

export const findUserById = async (userId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as UserRow | null) ?? null
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

export const updateUser = async (
  userId: string,
  data: {
    fullName?: string
    email?: string
    avatarUrl?: string | null
    locale?: string
  },
) => {
  const supabase = getSupabaseServiceRoleClient()

  const updatePayload: Record<string, unknown> = {}

  if (data.fullName !== undefined) {
    updatePayload.full_name = data.fullName
  }

  if (data.email !== undefined) {
    updatePayload.email = data.email.toLowerCase()
  }

  if (data.avatarUrl !== undefined) {
    updatePayload.avatar_url = data.avatarUrl
  }

  if (data.locale !== undefined) {
    updatePayload.locale = data.locale
  }

  const { data: userData, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return (userData as UserRow | null) ?? null
}
