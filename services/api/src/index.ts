import 'dotenv/config'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import sensible from '@fastify/sensible'

import { envPlugin } from './plugins/env'
import { registerCrmRoutes } from './routes/crm'
import { registerAgentRoutes } from './routes/agents'
import { registerHealthRoutes } from './routes/health'
import { registerKommoRoutes } from './routes/kommo'

const buildServer = () => {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  })

  app.register(envPlugin)
  app.register(cors, { origin: true })
  app.register(helmet)
  app.register(sensible)

  app.register(registerHealthRoutes, { prefix: '/health' })
  app.register(registerCrmRoutes, { prefix: '/crm' })
  app.register(registerKommoRoutes, { prefix: '/kommo' })
  app.register(registerAgentRoutes, { prefix: '/' })

  return app
}

const start = async () => {
  const app = buildServer()
  const port = Number.parseInt(process.env.PORT ?? '4000', 10)
  const host = process.env.HOST ?? '0.0.0.0'

  try {
    await app.listen({ port, host })
    app.log.info({ port, host }, 'API server started')
  } catch (error) {
    app.log.error(error, 'Failed to start API server')
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test') {
  await start()
}

export type AppInstance = ReturnType<typeof buildServer>
