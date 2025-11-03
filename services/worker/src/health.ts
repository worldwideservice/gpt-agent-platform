import { createServer } from 'http'

const PORT = process.env.PORT || 3001

export function startHealthServer() {
  const server = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          status: 'ok',
          service: 'worker',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        })
      )
    } else {
      res.writeHead(404)
      res.end('Not Found')
    }
  })

  server.listen(PORT, () => {
    console.log(`[worker] Health check server listening on port ${PORT}`)
  })

  return server
}

