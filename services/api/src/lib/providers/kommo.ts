import { URL } from 'node:url'

interface KommoTokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
  scope?: string
  base_domain: string
}

const toJSON = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Kommo API error: ${response.status} ${response.statusText} ${text}`)
  }

  return response.json() as Promise<KommoTokenResponse>
}

export const buildKommoAuthUrl = (
  baseDomain: string,
  clientId: string,
  redirectUri: string,
  scope: string,
  state: string,
) => {
  const url = new URL(`https://${baseDomain}/oauth2/authorize`)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', scope)
  url.searchParams.set('state', state)

  return url.toString()
}

export const exchangeKommoCodeForToken = async (params: {
  baseDomain: string
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
}) => {
  const response = await fetch(`https://${params.baseDomain}/oauth2/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      grant_type: 'authorization_code',
      code: params.code,
      redirect_uri: params.redirectUri,
    }),
  })

  return toJSON(response)
}

export const refreshKommoToken = async (params: {
  baseDomain: string
  clientId: string
  clientSecret: string
  refreshToken: string
}) => {
  const response = await fetch(`https://${params.baseDomain}/oauth2/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: params.refreshToken,
    }),
  })

  return toJSON(response)
}

export const kommoApiRequest = async <T>(params: {
  baseDomain: string
  accessToken: string
  path: string
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
}) => {
  const url = new URL(`/api/v4/${params.path.replace(/^\//, '')}`, `https://${params.baseDomain}`)
  const response = await fetch(url, {
    method: params.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Kommo request failed: ${response.status} ${response.statusText} ${text}`)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}
