import { nanoid } from 'nanoid'

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { slugify } from '@/lib/utils'

import type { OrganizationRow } from '@/types/supabase'

interface CreateOrganizationInput {
  name: string
  ownerId: string
}

export const createOrganizationWithOwner = async ({ name, ownerId }: CreateOrganizationInput) => {
  const supabase = getSupabaseServiceRoleClient()
  const baseSlug = (() => {
    const slug = slugify(name)
    return slug.length > 0 ? slug : `org-${nanoid(6).toLowerCase()}`
  })()

  let slugCandidate = baseSlug
  let slugIsUnique = false

  while (!slugIsUnique) {
    const { data } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slugCandidate)
      .maybeSingle()

    if (data) {
      slugCandidate = `${baseSlug}-${nanoid(4)}`
    } else {
      slugIsUnique = true
    }
  }

  const { data: organization, error: organizationError } = await supabase
    .from('organizations')
    .insert({ name, slug: slugCandidate })
    .select('*')
    .single<OrganizationRow>()

  if (organizationError) {
    throw organizationError
  }

  const { error: memberError } = await supabase.from('organization_members').insert({
    org_id: organization.id,
    user_id: ownerId,
    role: 'owner',
    status: 'active',
  })

  if (memberError) {
    throw memberError
  }

  const { error: updateUserError } = await supabase
    .from('users')
    .update({ default_org_id: organization.id })
    .eq('id', ownerId)

  if (updateUserError) {
    throw updateUserError
  }

  return organization
}

export const getOrganizationsForUser = async (userId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('organization_members')
    .select('role, organizations:organizations(id, name, slug)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (
    data ?? []
  ).map((item) => ({
    id: item.organizations?.id ?? '',
    name: item.organizations?.name ?? '',
    slug: item.organizations?.slug ?? '',
    role: item.role,
  }))
}

export const ensureUserMembership = async (userId: string, orgId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export const setDefaultOrganizationForUser = async (userId: string, orgId: string) => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase
    .from('users')
    .update({ default_org_id: orgId })
    .eq('id', userId)

  if (error) {
    throw error
  }
}
