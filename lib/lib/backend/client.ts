interface BackendRequestOptions extends RequestInit {
 searchParams?: Record<string, string | number | boolean | undefined>
}

const getBackendBaseUrl = () => {
 const url = process.env.BACKEND_API_URL

 if (!url) {
 throw new Error('BACKEND_API_URL is not configured')
 }

 return url.replace(/\/$/, '')
}

export const backendFetch = async <T>(path: string, options: BackendRequestOptions = {}): Promise<T> => {
 const baseUrl = getBackendBaseUrl()
 const url = new URL(path.replace(/^\//, ''), `${baseUrl}/`)

 if (options.searchParams) {
 Object.entries(options.searchParams).forEach(([key, value]) => {
 if (typeof value === 'undefined') {
 return
 }

 url.searchParams.set(key, String(value))
 })
 }

 const response = await fetch(url, {
 ...options,
 headers: {
 'Content-Type': 'application/json',
 ...(options.headers ?? {}),
 },
 })

 if (!response.ok) {
 const text = await response.text()
 throw new Error(`Backend request failed: ${response.status} ${response.statusText} ${text}`)
 }

 if (response.status === 204) {
 return null as T
 }

 if (response.headers.get('content-type')?.includes('application/json')) {
 return (await response.json()) as T
 }

 return undefined as T
}
