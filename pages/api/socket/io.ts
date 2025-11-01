import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import type { Socket } from 'net'
import type { Server as IOServer } from 'socket.io'

import { initializeWebSocketServer } from '@/lib/websocket/server'

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket) {
    res.status(500).json({ error: 'Socket not available' })
    return
  }

  if (!res.socket.server.io) {
    initializeWebSocketServer(res.socket.server)
  }

  res.end()
}
