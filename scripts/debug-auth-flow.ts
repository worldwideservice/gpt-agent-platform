import { getSupabaseServiceRoleClient } from '../lib/supabase/admin'

async function debugAuthFlow() {
  console.log('\n🔍 Debugging Authentication Flow\n')
  console.log('='.repeat(60))

  const supabase = getSupabaseServiceRoleClient()

  try {
    // 1. Проверяем количество пользователей
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, default_org_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (usersError) {
      console.error('❌ Error fetching users:', usersError)
      return
    }

    console.log(`\n📊 Recent users (${users?.length || 0}):`)
    users?.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email}`)
      console.log(`     ID: ${user.id}`)
      console.log(`     Name: ${user.full_name || 'N/A'}`)
      console.log(`     Default Org ID: ${user.default_org_id || 'NOT SET'}`)
      console.log(`     Created: ${user.created_at}`)
      console.log()
    })

    // 2. Проверяем организации
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, slug, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (orgsError) {
      console.error('❌ Error fetching organizations:', orgsError)
      return
    }

    console.log(`\n🏢 Recent organizations (${orgs?.length || 0}):`)
    orgs?.forEach((org, index) => {
      console.log(`  ${index + 1}. ${org.name}`)
      console.log(`     ID: ${org.id}`)
      console.log(`     Slug: ${org.slug || '❌ MISSING SLUG!'}`)
      console.log(`     Created: ${org.created_at}`)
      console.log()
    })

    // 3. Проверяем organization_members
    const { data: members, error: membersError } = await supabase
      .from('organization_members')
      .select('user_id, org_id, role, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (membersError) {
      console.error('❌ Error fetching organization members:', membersError)
      return
    }

    console.log(`\n👥 Recent organization memberships (${members?.length || 0}):`)
    members?.forEach((member, index) => {
      console.log(`  ${index + 1}. User ID: ${member.user_id.substring(0, 8)}...`)
      console.log(`     Org ID: ${member.org_id.substring(0, 8)}...`)
      console.log(`     Role: ${member.role}`)
      console.log(`     Status: ${member.status}`)
      console.log(`     Created: ${member.created_at}`)
      console.log()
    })

    // 4. Проверяем связь пользователей с организациями (JOIN)
    const { data: userOrgs, error: userOrgsError } = await supabase
      .from('organization_members')
      .select(`
        user_id,
        role,
        status,
        organizations:organizations(id, name, slug)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)

    if (userOrgsError) {
      console.error('❌ Error fetching user-org relationships:', userOrgsError)
      return
    }

    console.log(`\n🔗 User-Organization relationships (${userOrgs?.length || 0}):`)
    userOrgs?.forEach((rel: any, index) => {
      console.log(`  ${index + 1}. User ID: ${rel.user_id.substring(0, 8)}...`)
      console.log(`     Organization: ${rel.organizations?.name || 'N/A'}`)
      console.log(`     Org ID: ${rel.organizations?.id?.substring(0, 8)}... || 'N/A'}`)
      console.log(`     Org Slug: ${rel.organizations?.slug || '❌ MISSING SLUG!'}`)
      console.log(`     Role: ${rel.role}`)
      console.log()
    })

    // 5. Проверяем организации БЕЗ slug
    const { data: orgsWithoutSlug, error: orgsWithoutSlugError } = await supabase
      .from('organizations')
      .select('id, name, slug, created_at')
      .or('slug.is.null,slug.eq.')

    if (orgsWithoutSlugError) {
      console.error('❌ Error fetching organizations without slug:', orgsWithoutSlugError)
      return
    }

    if (orgsWithoutSlug && orgsWithoutSlug.length > 0) {
      console.log(`\n⚠️  Organizations WITHOUT slug (${orgsWithoutSlug.length}):`)
      orgsWithoutSlug.forEach((org, index) => {
        console.log(`  ${index + 1}. ${org.name}`)
        console.log(`     ID: ${org.id}`)
        console.log(`     Slug: ${org.slug || '❌ NULL'}`)
        console.log()
      })
    } else {
      console.log('\n✅ All organizations have slugs!')
    }

    // 6. Проверяем пользователей БЕЗ default_org_id
    const { data: usersWithoutOrg, error: usersWithoutOrgError } = await supabase
      .from('users')
      .select('id, email, full_name, default_org_id')
      .is('default_org_id', null)

    if (usersWithoutOrgError) {
      console.error('❌ Error fetching users without default_org_id:', usersWithoutOrgError)
      return
    }

    if (usersWithoutOrg && usersWithoutOrg.length > 0) {
      console.log(`\n⚠️  Users WITHOUT default_org_id (${usersWithoutOrg.length}):`)
      usersWithoutOrg.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email}`)
        console.log(`     ID: ${user.id}`)
        console.log(`     Default Org ID: ${user.default_org_id || '❌ NULL'}`)
        console.log()
      })
    } else {
      console.log('\n✅ All users have default_org_id!')
    }

    console.log('='.repeat(60))
    console.log('\n✅ Debug complete!\n')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugAuthFlow()
