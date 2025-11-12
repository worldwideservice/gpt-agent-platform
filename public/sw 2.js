// Service Worker for T11 Platform PWA
const CACHE_NAME = 't11-platform-v1.0.0'
const STATIC_CACHE = 't11-platform-static-v1.0.0'
const API_CACHE = 't11-platform-api-v1.0.0'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/globals.css',
  // Add other critical static assets
]

// API endpoints to cache (with short TTL)
const API_ENDPOINTS = [
  '/api/dashboard',
  '/api/agents',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (request.method === 'GET' && (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  )) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Default - network first for dynamic content
  event.respondWith(fetch(request))
})

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE)

  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    // Check if cache is still fresh (5 minutes)
    const cacheTime = cachedResponse.headers.get('sw-cache-time')
    if (cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
      return cachedResponse
    }
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseClone = networkResponse.clone()
      const responseWithCacheTime = new Response(responseClone.body, {
        ...responseClone,
        headers: {
          ...Object.fromEntries(responseClone.headers),
          'sw-cache-time': Date.now().toString()
        }
      })
      cache.put(request, responseWithCacheTime)
    }
    return networkResponse
  } catch (error) {
    // Return cached version if available, otherwise error
    return cachedResponse || new Response('Offline', { status: 503 })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE)

  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Return offline fallback for critical pages
    if (request.destination === 'document') {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GPT Agent - Offline</title>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; }
              .offline { max-width: 400px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="offline">
              <h1>🔌 Оффлайн режим</h1>
              <p>Приложение недоступно в автономном режиме. Пожалуйста, проверьте подключение к интернету.</p>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
    return new Response('Offline', { status: 503 })
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('[SW] Background sync triggered')
  // Implement background sync logic here
  // e.g., retry failed API requests, sync offline data
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
