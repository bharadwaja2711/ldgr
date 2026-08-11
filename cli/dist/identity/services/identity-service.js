import { ApiClient } from "../../core/api/client.js";
import { IdentityApi } from "../api/identity-api.js";
export class IdentityService {
    identityApi;
    credentialStore;
    apiClient;
    constructor(identityApi, credentialStore, apiClient) {
        this.identityApi = identityApi;
        this.credentialStore = credentialStore;
        this.apiClient = apiClient;
    }
    async register(request) {
        await this.identityApi.register(request);
    }
    async login(request) {
        const response = await this.identityApi.login(request);
        await this.credentialStore.save({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });
    }
    async whoami() {
        const credentials = await this.credentialStore.load();
        if (!credentials) {
            throw new Error("Not authenticated");
        }
        this.apiClient.setAccessToken(credentials.accessToken);
        return this.identityApi.me();
    }
    async logout() {
        await this.credentialStore.clear();
        this.apiClient.clearAccessToken();
    }
}
//# sourceMappingURL=identity-service.js.map