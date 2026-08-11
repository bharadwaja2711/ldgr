import { ApiClient } from "../../core/api/client.js";
import type { CredentialStore } from "../../core/auth/credentials.js";
import { IdentityApi } from "../api/identity-api.js";
import type { LoginRequest, MeResponse, RegisterRequest } from "../models/auth.js";

export class IdentityService {
  constructor(
      private readonly identityApi: IdentityApi,
      private readonly credentialStore: CredentialStore,
      private readonly apiClient: ApiClient,
  ) {}

  async register(request: RegisterRequest): Promise<void> {
    await this.identityApi.register(request);
  }

  async login(request: LoginRequest): Promise<void> {
    const response = await this.identityApi.login(request);

    await this.credentialStore.save({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  }

  async whoami(): Promise<MeResponse> {
    const credentials = await this.credentialStore.load();

    if (!credentials) {
      throw new Error("Not authenticated");
    }

    this.apiClient.setAccessToken(credentials.accessToken);

    return this.identityApi.me();
  }

  async logout(): Promise<void> {
    await this.credentialStore.clear();
    this.apiClient.clearAccessToken();
  }
}
