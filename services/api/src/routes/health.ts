import type { FastifyInstance } from 'fastify'

export const registerHealthRoutes = async (fastify: FastifyInstance) => {
 fastify.get('/', async () => {
 return { status: 'ok', timestamp: new Date().toISOString() }
 })
}
