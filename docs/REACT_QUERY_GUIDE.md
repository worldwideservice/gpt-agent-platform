# React Query Usage Guide

Comprehensive guide for using React Query (TanStack Query) in the GPT Agent Platform.

**Reference:** `docs/FRONTEND_ACTION_PLAN.md` (Week 3-4: React Query Integration)
**Version:** React Query v5.90.6
**Last Updated:** November 2025

---

## Table of Contents

1. [What is React Query?](#what-is-react-query)
2. [Why We Use React Query](#why-we-use-react-query)
3. [Setup and Configuration](#setup-and-configuration)
4. [Query Hooks](#query-hooks)
5. [Mutation Hooks](#mutation-hooks)
6. [Real-time Integration](#real-time-integration)
7. [Best Practices](#best-practices)
8. [Examples from Codebase](#examples-from-codebase)
9. [Migration Guide](#migration-guide)
10. [Troubleshooting](#troubleshooting)

---

## What is React Query?

React Query (TanStack Query) is a powerful data-fetching and state management library for React applications. It provides:

- **Automatic caching** - Data is cached and reused across components
- **Background refetching** - Keep data fresh automatically
- **Optimistic updates** - Update UI immediately, rollback on error
- **Deduplication** - Multiple requests for the same data = single network call
- **Stale-while-revalidate** - Show cached data while fetching fresh data

## Why We Use React Query

### Problems It Solves

1. **Manual Cache Management**
   ```tsx
   // ❌ Before: Manual state management
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   useEffect(() => {
     setLoading(true)
     fetch('/api/data')
       .then(res => res.json())
       .then(setData)
       .catch(setError)
       .finally(() => setLoading(false))
   }, [])

   // ✅ After: React Query handles everything
   const { data, isLoading, error } = useQuery({
     queryKey: ['data'],
     queryFn: fetchData,
   })
   ```

2. **Duplicate Requests**
   - Without React Query: Each component fetches the same data
   - With React Query: Single request, shared cache across all components

3. **Stale Data**
   - Without React Query: Manual refetching logic
   - With React Query: Automatic background refetching

4. **Optimistic Updates**
   - Without React Query: Complex state management and rollback logic
   - With React Query: Built-in optimistic update patterns

### Benefits in Our Codebase

- **Reduced API Calls:** Automatic deduplication and caching
- **Better UX:** Optimistic updates for instant feedback
- **Simplified Code:** Less boilerplate, cleaner components
- **Real-time Support:** Easy integration with Socket.io
- **Developer Experience:** React Query Devtools for debugging

---

## Setup and Configuration

### Installation

Already installed in the project:

```json
{
  "@tanstack/react-query": "^5.90.6",
  "@tanstack/react-query-devtools": "^5.90.2"
}
```

### Provider Setup

Located in `components/providers/QueryClientProvider.tsx`:

```tsx
import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes - data freshness
            gcTime: 10 * 60 * 1000,        // 10 minutes - cache lifetime
            retry: 1,                       // Retry failed requests once
            refetchOnWindowFocus: false,   // Don't refetch on window focus
          },
          mutations: {
            retry: 1,                       // Retry failed mutations once
          },
        },
      })
  )

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </TanStackQueryClientProvider>
  )
}
```

### App Integration

In `app/layout.tsx`:

```tsx
<QueryClientProvider>
  <SessionProviderWrapper>
    {/* Your app content */}
  </SessionProviderWrapper>
</QueryClientProvider>
```

---

## Query Hooks

### Basic Query Pattern

1. **Create API Client Function** (`lib/api/*.ts`)

```tsx
// lib/api/agents.ts
export async function fetchAgents(params?: FetchAgentsParams): Promise<AgentListItem[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.append('search', params.search)

  const response = await fetch(`/api/agents?${searchParams.toString()}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.statusText}`)
  }

  const data = await response.json()
  return data.agents
}
```

2. **Create Query Keys** (`lib/hooks/api/*.ts`)

Query keys are used for cache management:

```tsx
export const agentsKeys = {
  all: ['agents'] as const,                                    // ['agents']
  lists: () => [...agentsKeys.all, 'list'] as const,          // ['agents', 'list']
  list: (params?: FetchAgentsParams) =>
    [...agentsKeys.lists(), params] as const,                  // ['agents', 'list', params]
  detail: (id: string) =>
    [...agentsKeys.all, 'detail', id] as const,               // ['agents', 'detail', 'agent-123']
}
```

3. **Create Query Hook**

```tsx
export function useAgents(params?: FetchAgentsParams) {
  return useQuery({
    queryKey: agentsKeys.list(params),
    queryFn: () => fetchAgents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

4. **Use in Component**

```tsx
function AgentsList() {
  const { data: agents = [], isLoading, error } = useAgents({ search: 'support' })

  if (isLoading) return <Loader />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}
```

### Query Configuration Options

```tsx
useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction,

  // Cache configuration
  staleTime: 5 * 60 * 1000,        // How long data is considered fresh
  gcTime: 10 * 60 * 1000,          // How long unused data stays in cache

  // Refetch configuration
  refetchOnMount: true,             // Refetch when component mounts
  refetchOnWindowFocus: false,      // Don't refetch on window focus
  refetchOnReconnect: true,         // Refetch on network reconnect
  refetchInterval: false,           // Disable polling by default

  // Retry configuration
  retry: 1,                         // Retry failed requests once
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

  // Enable/disable query
  enabled: true,                    // Only fetch when enabled

  // Callbacks
  onSuccess: (data) => {},          // Called on successful fetch
  onError: (error) => {},           // Called on error
})
```

---

## Mutation Hooks

### Basic Mutation Pattern

Mutations are for creating, updating, or deleting data.

1. **Create Mutation Function** (`lib/api/*.ts`)

```tsx
export async function updateAgent({
  tenantId,
  agentId,
  data
}: UpdateAgentParams): Promise<AgentListItem> {
  const response = await fetch(`/api/manage/${tenantId}/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update agent: ${response.statusText}`)
  }

  return response.json()
}
```

2. **Create Mutation Hook**

```tsx
export function useUpdateAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
    },
  })
}
```

3. **Use in Component**

```tsx
function AgentToggle({ agent }: { agent: AgentListItem }) {
  const { mutate: updateAgent, isPending } = useUpdateAgent()

  const handleToggle = () => {
    updateAgent({
      tenantId: 'my-tenant',
      agentId: agent.id,
      data: { isActive: !agent.isActive },
    })
  }

  return (
    <Switch
      checked={agent.isActive}
      onCheckedChange={handleToggle}
      disabled={isPending}
    />
  )
}
```

### Optimistic Updates

Update UI immediately, rollback on error:

```tsx
export function useUpdateAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAgent,

    // 1. Before mutation starts
    onMutate: async ({ agentId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: agentsKeys.lists() })

      // Snapshot previous value
      const previousAgents = queryClient.getQueriesData({
        queryKey: agentsKeys.lists()
      })

      // Optimistically update cache
      queryClient.setQueriesData({ queryKey: agentsKeys.lists() }, (old: AgentListItem[] | undefined) => {
        if (!old) return old
        return old.map((agent) =>
          agent.id === agentId ? { ...agent, ...data } : agent
        )
      })

      // Return context with snapshot
      return { previousAgents }
    },

    // 2. If mutation fails, rollback
    onError: (_err, _variables, context) => {
      if (context?.previousAgents) {
        context.previousAgents.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // 3. Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
    },
  })
}
```

### Mutation Callbacks

```tsx
const { mutate } = useUpdateAgent()

// With callbacks
mutate(
  { tenantId, agentId, data },
  {
    onSuccess: (updatedAgent) => {
      toast.success('Agent updated successfully')
      router.push(`/agents/${updatedAgent.id}`)
    },
    onError: (error) => {
      toast.error('Failed to update agent', {
        description: error.message,
      })
    },
  }
)
```

---

## Real-time Integration

### Combining React Query with Socket.io

Example: `lib/hooks/api/use-notifications.ts`

```tsx
export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const websocket = useWebSocket()
  const [isConnected, setIsConnected] = useState(false)

  // 1. Fetch initial data via React Query
  const query = useQuery({
    queryKey: notificationsKeys.list(),
    queryFn: fetchNotifications,
    staleTime: 1 * 60 * 1000, // 1 minute
  })

  // 2. Subscribe to Socket.io events
  useEffect(() => {
    const unsubscribe = websocket.onNotification((notification) => {
      // Update React Query cache with new notification
      queryClient.setQueryData<Notification[]>(
        notificationsKeys.list(),
        (old = []) => [notification, ...old]
      )

      // Invalidate to trigger refetch
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.lists()
      })
    })

    void websocket.connect()

    return () => {
      unsubscribe()
    }
  }, [websocket, queryClient])

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    isConnected,
  }
}
```

### Benefits of This Pattern

1. **Initial Load:** Fast load from cache or API
2. **Real-time Updates:** Instant updates via WebSocket
3. **Cache Sync:** React Query keeps everything in sync
4. **Offline Support:** Cache works even when WebSocket is disconnected

---

## Best Practices

### 1. Query Key Organization

Use a hierarchical structure:

```tsx
export const agentsKeys = {
  all: ['agents'] as const,
  lists: () => [...agentsKeys.all, 'list'] as const,
  list: (filters) => [...agentsKeys.lists(), filters] as const,
  details: () => [...agentsKeys.all, 'detail'] as const,
  detail: (id) => [...agentsKeys.details(), id] as const,
}
```

### 2. Separation of Concerns

- **API Layer** (`lib/api/`): Pure API calls, no React
- **Hooks Layer** (`lib/hooks/api/`): React Query hooks
- **Component Layer**: UI and interactions

### 3. Error Handling

```tsx
const { data, error, isError } = useAgents()

if (isError) {
  return <ErrorBoundary error={error} />
}
```

### 4. Loading States

```tsx
const { data, isLoading, isFetching } = useAgents()

// isLoading: First fetch, no cached data
// isFetching: Fetching (may have cached data)

if (isLoading) return <Skeleton />
if (isFetching) return <div>{data} <Spinner /></div>
```

### 5. Stale Time Configuration

Different data has different freshness requirements:

```tsx
// Frequently changing data (1-2 minutes)
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 1 * 60 * 1000,
})

// Rarely changing data (10+ minutes)
useQuery({
  queryKey: ['organizations'],
  queryFn: fetchOrganizations,
  staleTime: 10 * 60 * 1000,
})
```

### 6. Avoid Over-fetching

```tsx
// ❌ Bad: Refetching too often
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 1000, // Every second!
})

// ✅ Good: Use real-time updates instead
useRealtimeData() // Socket.io integration
```

### 7. Dependent Queries

Only fetch when dependencies are available:

```tsx
const { data: user } = useUser()

const { data: posts } = useUserPosts(user?.id, {
  enabled: !!user?.id, // Only fetch when user ID exists
})
```

---

## Examples from Codebase

### 1. Agents Management

**Location:** `lib/hooks/api/use-agents.ts`

```tsx
// Query hook
export function useAgents(params?: FetchAgentsParams) {
  return useQuery({
    queryKey: agentsKeys.list(params),
    queryFn: () => fetchAgents(params),
    staleTime: 5 * 60 * 1000,
  })
}

// Mutation hook with optimistic updates
export function useUpdateAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAgent,
    onMutate: async ({ agentId, data }) => {
      await queryClient.cancelQueries({ queryKey: agentsKeys.lists() })
      const previousAgents = queryClient.getQueriesData({ queryKey: agentsKeys.lists() })

      queryClient.setQueriesData({ queryKey: agentsKeys.lists() }, (old: AgentListItem[] | undefined) => {
        if (!old) return old
        return old.map((agent) => (agent.id === agentId ? { ...agent, ...data } : agent))
      })

      return { previousAgents }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousAgents) {
        context.previousAgents.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
    },
  })
}
```

### 2. Organizations

**Location:** `lib/hooks/api/use-organizations.ts`

```tsx
export function useOrganizations() {
  return useQuery({
    queryKey: organizationsKeys.lists(),
    queryFn: fetchOrganizations,
    staleTime: 10 * 60 * 1000, // Organizations rarely change
  })
}
```

### 3. Real-time Notifications

**Location:** `lib/hooks/api/use-notifications.ts`

```tsx
export function useRealtimeNotifications(params?: FetchNotificationsParams) {
  const queryClient = useQueryClient()
  const websocket = useWebSocket()

  // Fetch via React Query
  const query = useNotifications(params)

  // Subscribe to Socket.io
  useEffect(() => {
    const unsubscribe = websocket.onNotification((notification) => {
      queryClient.setQueryData<Notification[]>(
        notificationsKeys.list(params),
        (old = []) => [notification, ...old]
      )
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() })
    })

    void websocket.connect()
    return () => unsubscribe()
  }, [websocket, queryClient, params])

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    // ... mutations
  }
}
```

---

## Migration Guide

### Migrating Existing Components

**Before: Manual fetch with useEffect**

```tsx
function AgentsList() {
  const [agents, setAgents] = useState<AgentListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data.agents))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <Error />

  return <AgentTable agents={agents} />
}
```

**After: React Query**

```tsx
function AgentsList() {
  const { data: agents = [], isLoading, error } = useAgents()

  if (isLoading) return <Spinner />
  if (error) return <Error />

  return <AgentTable agents={agents} />
}
```

### Migration Steps

1. **Create API client function** in `lib/api/`
2. **Create query keys** in hook file
3. **Create query hook** in `lib/hooks/api/`
4. **Replace component logic** with hook
5. **Test thoroughly**

---

## Troubleshooting

### Cache Not Updating

**Problem:** Changes not reflected in UI

**Solution:** Invalidate queries after mutations

```tsx
queryClient.invalidateQueries({ queryKey: agentsKeys.lists() })
```

### Duplicate Requests

**Problem:** Multiple identical requests

**Solution:** Use consistent query keys

```tsx
// ❌ Bad: Different objects = different keys
useQuery({ queryKey: ['agents', { search: 'test' }], ... })
useQuery({ queryKey: ['agents', { search: 'test' }], ... }) // New object!

// ✅ Good: Use query key factory
useQuery({ queryKey: agentsKeys.list({ search: 'test' }), ... })
```

### Stale Data

**Problem:** Data doesn't update

**Solution:** Adjust `staleTime` or enable refetching

```tsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 1 * 60 * 1000, // Shorter stale time
  refetchOnMount: true,      // Refetch on mount
})
```

### Memory Leaks

**Problem:** Queries not cleaning up

**Solution:** Use `gcTime` configuration

```tsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  gcTime: 5 * 60 * 1000, // Clean up after 5 minutes
})
```

---

## React Query Devtools

### Accessing Devtools

In development mode, click the React Query icon in the bottom-left corner.

### Features

- **Query Inspector:** See all queries and their states
- **Cache Explorer:** Inspect cached data
- **Timeline:** View query history
- **Actions:** Manually refetch or invalidate queries

### Tips

1. Check query states: `fresh`, `fetching`, `stale`, `inactive`
2. Inspect cache to debug stale data issues
3. Use timeline to find duplicate requests
4. Manually invalidate queries to test refetching

---

## Additional Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Query Examples](https://tanstack.com/query/latest/docs/react/examples/react/simple)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- Codebase: `lib/hooks/api/` for examples

---

## Summary

React Query provides:

✅ **Automatic caching** - No manual cache management
✅ **Optimistic updates** - Instant UI feedback
✅ **Deduplication** - Single request for same data
✅ **Real-time integration** - Works great with Socket.io
✅ **Developer experience** - Cleaner code, better debugging

Use React Query for all data fetching in the application. It simplifies code, improves UX, and provides a solid foundation for real-time features.
