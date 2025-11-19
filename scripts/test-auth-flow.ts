import { getSupabaseServiceRoleClient } from '../lib/supabase/admin'
import { getOrganizationsForUser } from '../lib/repositories/organizations'
import { UserRepository } from '../lib/repositories/users'
import { compare } from 'bcryptjs'

async function testAuthFlow() {
  console.log('\n🧪 Testing Auth Flow for admin@worldwideservices.eu\n')
  console.log('='.repeat(60))

  const supabase = getSupabaseServiceRoleClient()
  const testEmail = 'admin@worldwideservices.eu'

  try {
    // 1. Find user by email
    console.log('\n📝 Step 1: Finding user by email...')
    const user = await UserRepository.findUserByEmail(testEmail)

    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('✅ User found:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.full_name}`)
    console.log(`   Default Org ID: ${user.default_org_id || 'NOT SET'}`)
    console.log(`   Has password: ${!!user.password_hash}`)

    // 2. Check password (simulate)
    console.log('\n📝 Step 2: Password check...')
    if (!user.password_hash) {
      console.log('❌ No password hash found!')
      return
    }
    console.log('✅ Password hash exists')

    // 3. Get organizations
    console.log('\n📝 Step 3: Getting organizations for user...')
    let defaultOrgId = user.default_org_id ?? undefined
    let defaultOrgSlug: string | undefined

    if (!defaultOrgId) {
      console.log('⚠️  No default_org_id in user record, fetching from memberships...')
      const memberships = await getOrganizationsForUser(user.id)
      console.log(`   Found ${memberships.length} memberships`)

      if (memberships.length > 0) {
        defaultOrgId = memberships[0].id
        defaultOrgSlug = memberships[0].slug
        console.log(`   Using first membership:`)
        console.log(`     Org ID: ${defaultOrgId}`)
        console.log(`     Org Slug: ${defaultOrgSlug}`)
      } else {
        console.log('❌ No organizations found for user!')
        return
      }
    } else {
      console.log(`✅ User has default_org_id: ${defaultOrgId}`)
    }

    // 4. Fetch organization slug if not yet available
    if (!defaultOrgSlug) {
      console.log('\n📝 Step 4: Fetching organization slug...')
      const memberships = await getOrganizationsForUser(user.id)
      console.log(`   Found ${memberships.length} memberships:`)

      memberships.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.name}`)
        console.log(`      ID: ${m.id}`)
        console.log(`      Slug: ${m.slug || '❌ NO SLUG'}`)
        console.log(`      Role: ${m.role}`)
      })

      const membership = memberships.find((m) => m.id === defaultOrgId)
      defaultOrgSlug = membership?.slug

      if (defaultOrgSlug) {
        console.log(`✅ Found slug: ${defaultOrgSlug}`)
      } else {
        console.log(`❌ Slug not found for org ${defaultOrgId}`)
      }
    } else {
      console.log(`✅ Already have slug: ${defaultOrgSlug}`)
    }

    // 5. Final check
    console.log('\n📝 Step 5: Final authentication result...')
    if (!defaultOrgSlug) {
      console.log('❌ Authentication would FAIL: Unable to determine organization slug')
      console.log('   This is why user cannot login!')
      return
    }

    console.log('✅ Authentication would SUCCEED!')
    console.log(`   Redirect URL: /manage/${defaultOrgSlug}`)
    console.log(`   User session would contain:`)
    console.log(`     - id: ${user.id}`)
    console.log(`     - email: ${user.email}`)
    console.log(`     - name: ${user.full_name ?? user.email}`)
    console.log(`     - orgId: ${defaultOrgId}`)
    console.log(`     - organizationSlug: ${defaultOrgSlug}`)

    console.log('\n='.repeat(60))
    console.log('✅ Test complete!')

  } catch (error) {
    console.error('\n❌ Error during test:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
  }
}

testAuthFlow()
