import { ApiClient } from "../../core/api/client.js";
import type { CredentialStore } from "../../core/auth/credentials.js";
import { IdentityApi } from "../api/identity-api.js";
import type { LoginRequest, MeResponse, RegisterRequest } from "../models/auth.js";
export declare class IdentityService {
    private readonly identityApi;
    private readonly credentialStore;
    private readonly apiClient;
    constructor(identityApi: IdentityApi, credentialStore: CredentialStore, apiClient: ApiClient);
    register(request: RegisterRequest): Promise<void>;
    login(request: LoginRequest): Promise<void>;
    whoami(): Promise<MeResponse>;
    logout(): Promise<void>;
}
//# sourceMappingURL=identity-service.d.ts.map