import { ApiClient } from "../../core/api/client.js";
import { KeychainCredentialStore } from "../../core/auth/keychain-store.js";
import { IdentityApi } from "../api/identity-api.js";
import { IdentityService } from "../services/identity-service.js";
export async function logout() {
    const client = new ApiClient();
    const credentialStore = new KeychainCredentialStore();
    const identityApi = new IdentityApi(client);
    const identityService = new IdentityService(identityApi, credentialStore, client);
    await identityService.logout();
    console.log("✓ Logged out");
}
//# sourceMappingURL=logout.js.map