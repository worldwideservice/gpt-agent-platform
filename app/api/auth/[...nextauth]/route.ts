import { handlers } from '@/auth'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const { GET, POST } = handlers
