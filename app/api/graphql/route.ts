import { NextRequest, NextResponse } from 'next/server'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { auth } from '@/auth'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    // Get user from session
    const session = await auth()

    return {
      user: session?.user ? {
        id: session.user.id,
        orgId: session.user.orgId,
      } : undefined,
    }
  },
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
