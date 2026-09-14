import { ApiClient, ApiError } from "../../core/api/client.js";
import type { CredentialStore } from "../../core/auth/credentials.js";
import { IdentityApi } from "../api/identity-api.js";
import type {
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from "../models/auth.js";

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

    try {
      return await this.identityApi.me();
    } catch (error: unknown) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }

      const refreshed = await this.identityApi.refresh(
        credentials.refreshToken,
      );

      await this.credentialStore.save({
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
      });

      this.apiClient.setAccessToken(refreshed.accessToken);

      return await this.identityApi.me();
    }
  }

  async logout(): Promise<void> {
    const credentials = await this.credentialStore.load();

    if (!credentials) {
      this.apiClient.clearAccessToken();
      return;
    }

    try {
      await this.identityApi.logout(credentials.refreshToken);
    } finally {
      await this.credentialStore.clear();
      this.apiClient.clearAccessToken();
    }
  }
}
