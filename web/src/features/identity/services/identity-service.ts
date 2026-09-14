import { ApiClient } from '../../../core/api/client'
import {
  authStorage,
  type Credentials,
} from '../../../core/auth/storage'
import {
  IdentityApi,
  type LoginRequest,
  type MeResponse,
  type RegisterRequest,
} from '../api/identity-api'

export class IdentityService {
  constructor(
    private readonly api: IdentityApi,
    private readonly client: ApiClient,
  ) {}

  async login(request: LoginRequest): Promise<void> {
    const response = await this.api.login(request)

    this.saveSession({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    })

    localStorage.setItem('ldgr.userId', response.userId)
    localStorage.setItem('ldgr.email', response.email)
  }

  async register(request: RegisterRequest): Promise<void> {
    await this.api.register(request)
  }

  async me(): Promise<MeResponse> {
    const credentials = authStorage.load()

    if (!credentials) {
      throw new Error('Not authenticated')
    }

    this.client.setAccessToken(credentials.accessToken)

    return this.api.me()
  }

  async logout(): Promise<void> {
    const credentials = authStorage.load()

    if (!credentials) {
      this.client.clearAccessToken()
      return
    }

    try {
      await this.api.logout(credentials.refreshToken)
    } finally {
      authStorage.clear()
      this.client.clearAccessToken()
    }
  }

  isAuthenticated(): boolean {
    return authStorage.load() !== null
  }

  private saveSession(credentials: Credentials): void {
    authStorage.save(credentials)
    this.client.setAccessToken(credentials.accessToken)
  }
}

const apiClient = new ApiClient()
const identityApi = new IdentityApi(apiClient)

export const identityService = new IdentityService(
  identityApi,
  apiClient,
)
