/**
 * JWT Authentication Plugin для Fastify API
 *
 * Проверяет JWT токен из Authorization header и декодирует user данные
 */

import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

// Расширяем тип FastifyRequest для добавления user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      organizationId: string
      role?: string
    }
  }
}

/**
 * Auth plugin с JWT support
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
  // JWT Secret validation - КРИТИЧНО для production
  const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

  if (!jwtSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: JWT_SECRET or NEXTAUTH_SECRET must be set in production')
    }
    fastify.log.warn('Using default JWT secret for development - DO NOT USE IN PRODUCTION')
  }

  // Регистрируем JWT plugin
  await fastify.register(jwt, {
    secret: jwtSecret || 'dev-only-secret-change-in-production',
    sign: {
      expiresIn: '7d',
    },
  })

  // Декоратор для проверки авторизации
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      // Проверяем наличие Authorization header
      const authHeader = request.headers.authorization

      if (!authHeader) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Missing Authorization header'
        })
      }

      // Извлекаем токен
      const token = authHeader.replace(/^Bearer\s+/i, '')

      if (!token) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid Authorization header format'
        })
      }

      // Верифицируем JWT токен
      try {
        const decoded = await fastify.jwt.verify(token)

        // Проверяем что токен содержит необходимые поля
        if (!decoded || typeof decoded !== 'object') {
          throw new Error('Invalid token payload')
        }

        // Маппим decoded token на user object
        request.user = {
          id: decoded.sub || decoded.userId || decoded.id,
          email: decoded.email,
          organizationId: decoded.organizationId || decoded.org_id,
          role: decoded.role,
        }

        // Валидация обязательных полей
        if (!request.user.id) {
          throw new Error('Token missing user ID')
        }

        if (!request.user.organizationId) {
          throw new Error('Token missing organization ID')
        }

      } catch (jwtError: any) {
        fastify.log.warn({ error: jwtError.message }, 'JWT verification failed')

        return reply.code(401).send({
          error: 'Unauthorized',
          message: jwtError.message === 'jwt expired'
            ? 'Token has expired'
            : 'Invalid token'
        })
      }
    } catch (error: any) {
      fastify.log.error({ error: error.message }, 'Authentication error')

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Authentication failed'
      })
    }
  })
}

export default fp(authPlugin)
