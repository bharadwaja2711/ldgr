import type { ApiClient } from '../../../core/api/client'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  userId: string
  email: string
  accessToken: string
  refreshToken: string
}

export type RegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type RegisterResponse = {
  id: string
  email: string
  firstName: string
  lastName: string
}

export type MeResponse = {
  email: string
  status: string
}

export class IdentityApi {
  constructor(private readonly client: ApiClient) {}

  login(request: LoginRequest): Promise<LoginResponse> {
    return this.client.post<LoginRequest, LoginResponse>(
      '/api/v1/auth/login',
      request,
    )
  }

  register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.client.post<RegisterRequest, RegisterResponse>(
      '/api/v1/auth/register',
      request,
    )
  }

  refresh(refreshToken: string): Promise<LoginResponse> {
    return this.client.post<
      { refreshToken: string },
      LoginResponse
    >('/api/v1/auth/refresh', {
      refreshToken,
    })
  }

  logout(refreshToken: string): Promise<void> {
    return this.client.post<
      { refreshToken: string },
      void
    >('/api/v1/auth/logout', {
      refreshToken,
    })
  }

  me(): Promise<MeResponse> {
    return this.client.get<MeResponse>('/api/v1/security/me')
  }
}
