import 'next-auth'
import 'next-auth/jwt'

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
 interface Session {
 user: DefaultSession['user'] & {
 id: string
 orgId?: string
 }
 }

 interface User {
 id: string
 email: string
 name?: string | null
 orgId: string
 }
}

declare module 'next-auth/jwt' {
 interface JWT {
 orgId?: string
 }
}

