/**
 * API Documentation Endpoint
 *
 * Задача 5.2: Documentation
 * Отображает Swagger UI для API документации
 */

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import yaml from 'js-yaml'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

let cachedSpec: unknown

async function loadSpec() {
  if (!cachedSpec) {
    // Загружаем OpenAPI спецификацию из YAML
    const specPath = join(process.cwd(), 'docs', 'openapi.yaml')
    try {
      const fileContents = await readFile(specPath, 'utf-8')
      cachedSpec = yaml.load(fileContents)
    } catch (error) {
      // Fallback на старый api-spec.json если openapi.yaml не найден
      const fallbackPath = join(process.cwd(), 'public', 'api-spec.json')
      const fileContents = await readFile(fallbackPath, 'utf-8')
      cachedSpec = JSON.parse(fileContents)
    }
  }

  return cachedSpec
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'html'

  // Загружаем спецификацию
  const spec = await loadSpec()

  // Возвращаем в зависимости от формата
  if (format === 'json') {
    return NextResponse.json(spec)
  }

  if (format === 'yaml') {
    const specPath = join(process.cwd(), 'docs', 'openapi.yaml')
    const yamlContent = await readFile(specPath, 'utf-8')
    return new NextResponse(yamlContent, {
      headers: {
        'Content-Type': 'text/yaml',
      },
    })
  }

  // HTML с Swagger UI
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GPT Agent Platform - API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .swagger-ui .topbar {
      background-color: #1a1a1a;
    }
    .swagger-ui .info .title {
      color: #4f46e5;
    }
    .swagger-ui .scheme-container {
      background-color: #fafafa;
      padding: 10px 20px;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs?format=json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        syntaxHighlight: {
          activate: true,
          theme: 'monokai'
        }
      })

      window.ui = ui
    }
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
