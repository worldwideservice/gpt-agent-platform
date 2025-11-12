export interface DemoWebhookEvent {
  id: string
  org_id: string
  provider: string
  event_type: string
  status: string
  payload?: Record<string, unknown> | null
  error?: string | null
  created_at: string
  retry_count?: number | null
  next_retry_at?: string | null
}

type DemoWebhookEventStore = Map<string, DemoWebhookEvent>

const STORE_SYMBOL = Symbol.for('gpt-agent-platform.demo-webhook-events')

const getStore = (): DemoWebhookEventStore => {
  const globalSymbols = Object.getOwnPropertySymbols(globalThis)
  if (!globalSymbols.includes(STORE_SYMBOL)) {
    ;(globalThis as unknown as Record<symbol, DemoWebhookEventStore>)[STORE_SYMBOL] = new Map()
  }

  return (globalThis as unknown as Record<symbol, DemoWebhookEventStore>)[STORE_SYMBOL]
}

export const saveDemoWebhookEvent = (event: DemoWebhookEvent): DemoWebhookEvent => {
  const store = getStore()
  store.set(event.id, event)
  return event
}

export const listDemoWebhookEvents = (orgId: string): DemoWebhookEvent[] => {
  const store = getStore()
  return Array.from(store.values())
    .filter((event) => event.org_id === orgId)
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
}

export const getDemoWebhookEvent = (eventId: string): DemoWebhookEvent | undefined => {
  return getStore().get(eventId)
}

export const deleteDemoWebhookEvent = (eventId: string): boolean => {
  return getStore().delete(eventId)
}

export const requeueDemoWebhookEvent = (eventId: string): DemoWebhookEvent | null => {
  const store = getStore()
  const existing = store.get(eventId)

  if (!existing) {
    return null
  }

  const updated: DemoWebhookEvent = {
    ...existing,
    status: 'pending',
    retry_count: (existing.retry_count ?? 0) + 1,
    next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    error: null,
  }

  store.set(eventId, updated)

  return updated
}
