
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load production env
dotenv.config({ path: path.resolve(process.cwd(), 'env.production') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('Connecting to Supabase:', supabaseUrl)

    // Check if we can list organizations
    console.log('Fetching organizations...')
    const { data: orgs, error: listError } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .limit(5)

    if (listError) {
        console.error('Error listing organizations:', listError)
    } else {
        console.log('Organizations found:', orgs)
    }

    // Try to fetch org with ID "44"
    console.log('Fetching org with ID "44"...')
    const { data: org44, error: error44 } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', '44')
        .maybeSingle()

    if (error44) {
        console.error('Error fetching org 44:', error44)
    } else {
        console.log('Org 44 result:', org44)
    }

    // Try to fetch org with ID "44-makysm-holovatyi" (just in case)
    console.log('Fetching org with ID "44-makysm-holovatyi"...')
    const { data: orgSlug, error: errorSlug } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', '44-makysm-holovatyi')
        .maybeSingle()

    if (errorSlug) {
        console.error('Error fetching org slug:', errorSlug)
    } else {
        console.log('Org slug result:', orgSlug)
    }

    // Fetch user admin@worldwideservice.eu
    console.log('Fetching user admin@worldwideservice.eu...')
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@worldwideservice.eu')
        .maybeSingle()

    if (userError) {
        console.error('Error fetching user:', userError)
    } else {
        console.log('User found:', user)
    }
}

main()
