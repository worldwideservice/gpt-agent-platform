import { NextResponse } from 'next/server'
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
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
    './app/api/**/*.ts',
    './app/api/**/*.tsx',
  ],
}

const specs = swaggerJsdoc(options)

export const GET = async () => {
  return NextResponse.json(specs)
}
