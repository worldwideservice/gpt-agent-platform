import crypto from 'node:crypto'

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { PasswordResetRow } from '@/types/supabase'

const RESET_TTL_MINUTES = 60

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const createPasswordReset = async (
  userId: string,
  ttlMinutes: number = RESET_TTL_MINUTES,
): Promise<{ token: string; expiresAt: string }> => {
  const supabase = getSupabaseServiceRoleClient()

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()

  await supabase
    .from('password_resets')
    .delete()
    .eq('user_id', userId)
    .is('used_at', null)

  const { error } = await supabase
    .from('password_resets')
    .insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    })

  if (error) {
    throw error
  }

  return { token, expiresAt }
}

export const findValidPasswordResetByToken = async (token: string): Promise<PasswordResetRow | null> => {
  const supabase = getSupabaseServiceRoleClient()
  const tokenHash = hashToken(token)

  const { data, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error) {
    throw error
  }

  const row = data as PasswordResetRow | null

  if (!row) {
    return null
  }

  if (row.used_at) {
    return null
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return null
  }

  return row
}

export const markPasswordResetAsUsed = async (id: string, userId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const usedAt = new Date().toISOString()

  const { error } = await supabase
    .from('password_resets')
    .update({ used_at: usedAt })
    .eq('id', id)

  if (error) {
    throw error
  }

  await supabase
    .from('password_resets')
    .delete()
    .eq('user_id', userId)
    .is('used_at', null)
}
