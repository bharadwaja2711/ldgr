import { ApiClient } from "../../core/api/client.js";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
} from "../models/auth.js";

export class IdentityApi {
  constructor(private readonly client: ApiClient) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.client.post<LoginRequest, LoginResponse>(
      "/api/v1/auth/login",
      request,
    );
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    return this.client.post<
      { refreshToken: string },
      LoginResponse
    >(
      "/api/v1/auth/refresh",
      { refreshToken },
    );
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post<
      { refreshToken: string },
      void
    >(
      "/api/v1/auth/logout",
      { refreshToken },
    );
  }

  async me(): Promise<MeResponse> {
    return this.client.get<MeResponse>(
      "/api/v1/security/me",
    );
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.client.post<RegisterRequest, RegisterResponse>(
      "/api/v1/auth/register",
      request,
    );
  }
}
