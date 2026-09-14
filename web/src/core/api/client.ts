import { authStorage } from '../auth/storage'

const API_BASE_URL = ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private accessToken: string | undefined

  setAccessToken(token: string): void {
    this.accessToken = token
  }

  clearAccessToken(): void {
    this.accessToken = undefined
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path)
  }

  post<TRequest, TResponse>(
    path: string,
    body: TRequest,
  ): Promise<TResponse> {
    return this.request<TResponse>('POST', path, body)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const response = await this.performRequest(method, path, body)

    if (response.status !== 401 || path === '/api/v1/auth/refresh') {
      return this.handleResponse<T>(response)
    }

    const credentials = authStorage.load()

    if (!credentials) {
      return this.handleResponse<T>(response)
    }

    try {
      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/v1/auth/refresh`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: credentials.refreshToken,
          }),
        },
      )

      if (!refreshResponse.ok) {
        authStorage.clear()
        this.clearAccessToken()
        return this.handleResponse<T>(response)
      }

      const refreshed = await refreshResponse.json() as {
        userId: string
        email: string
        accessToken: string
        refreshToken: string
      }

      authStorage.save({
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
      })

      localStorage.setItem('ldgr.userId', refreshed.userId)
      localStorage.setItem('ldgr.email', refreshed.email)

      this.setAccessToken(refreshed.accessToken)

      const retry = await this.performRequest(method, path, body)

      return this.handleResponse<T>(retry)
    } catch {
      authStorage.clear()
      this.clearAccessToken()
      return this.handleResponse<T>(response)
    }
  }

  private async performRequest(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text()

    let data: unknown

    try {
      data = text ? JSON.parse(text) : undefined
    } catch {
      data = text
    }

    if (!response.ok) {
      const message =
        typeof data === 'object' &&
        data !== null &&
        'message' in data
          ? String((data as { message: unknown }).message)
          : `Request failed with status ${response.status}`

      throw new ApiError(response.status, message)
    }

    return data as T
  }
}
