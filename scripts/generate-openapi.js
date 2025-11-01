#!/usr/bin/env node

/**
 * Генерирует OpenAPI спецификацию и сохраняет её в public/api-spec.json
 */

const { mkdirSync, writeFileSync } = require('fs')
const { join } = require('path')
const swaggerJsdoc = require('swagger-jsdoc')

const projectRoot = process.cwd()
const outputDir = join(projectRoot, 'public')
const outputPath = join(outputDir, 'api-spec.json')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GPT Agent Platform API',
      version: '1.0.0',
      description: 'API для платформы обучения ИИ-агентов',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Основной сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    join(projectRoot, 'app/api/**/*.ts'),
    join(projectRoot, 'app/api/**/*.tsx'),
  ],
}

try {
  const specs = swaggerJsdoc(swaggerOptions)
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, JSON.stringify(specs, null, 2))
  console.log('generate-openapi: OpenAPI spec written to', outputPath)
} catch (error) {
  console.error('generate-openapi: failed to generate OpenAPI spec:', error)
  process.exitCode = 1
}
