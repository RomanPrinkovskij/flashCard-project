const baseUrl = 'http://localhost:42069'
const refreshEndpoint = '/auth/refresh'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

export interface MutatorOptions {
  method?: string
  path?: string       // optional path (for orval or your calls)
  url?: string        // orval often uses url
  body?: any          // legacy request body
  data?: any          // orval uses data for request body
  headers?: Record<string, string>
  signal?: AbortSignal
}

export const fetchWithAuth = async <T>({
  method = 'GET',
  path,
  url,
  body,
  data,
  headers = {},
  signal,
}: MutatorOptions): Promise<T> => {
  const endpoint = url ?? path ?? ''

  // use data first if present, else fallback to body
  const requestBody = data ?? body

  const doRequest = async (): Promise<Response> => {
    const accessToken = localStorage.getItem('accessToken')

    const fetchHeaders: Record<string, string> = {
      ...headers,
    }

    // Set Authorization header if token available
    if (accessToken) {
      fetchHeaders['Authorization'] = `Bearer ${accessToken}`
    }

    // For FormData, do NOT set Content-Type, browser sets it automatically
    const isFormData = requestBody instanceof FormData
    if (!isFormData && method !== 'GET') {
      if (!fetchHeaders['Content-Type']) {
        fetchHeaders['Content-Type'] = 'application/json'
      }
    }

    return fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: fetchHeaders,
      body:
        method !== 'GET' && requestBody
          ? isFormData
            ? requestBody
            : JSON.stringify(requestBody)
          : undefined,
      signal,
    })
  }

  let res = await doRequest()

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = (async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const r = await fetch(`${baseUrl}${refreshEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })

        if (!r.ok) throw new Error('Refresh failed')

        const { accessToken: newAT, refreshToken: newRT } = await r.json()

        localStorage.setItem('accessToken', newAT)
        localStorage.setItem('refreshToken', newRT)
      })().finally(() => {
        isRefreshing = false
      })
    }

    try {
      await refreshPromise
      res = await doRequest() // retry once with new token
    } catch {
      // refresh failed; keep original 401
    }
  }

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  const dataResponse = await res.json()
  return dataResponse as T
}

export default fetchWithAuth
