import { input, password } from "@inquirer/prompts";
import { ApiClient, ApiError } from "../../core/api/client.js";
import { KeychainCredentialStore } from "../../core/auth/keychain-store.js";
import { IdentityApi } from "../api/identity-api.js";
import { IdentityService } from "../services/identity-service.js";
export async function login() {
    const email = await input({
        message: "Email:",
    });
    const userPassword = await password({
        message: "Password:",
        mask: "*",
    });
    const client = new ApiClient();
    const credentialStore = new KeychainCredentialStore();
    const identityApi = new IdentityApi(client);
    const identityService = new IdentityService(identityApi, credentialStore, client);
    try {
        await identityService.login({
            email,
            password: userPassword,
        });
        console.log("✓ Authenticated");
    }
    catch (error) {
        if (error instanceof ApiError) {
            console.error(`✗ ${error.message}`);
            return;
        }
        console.error("✗ An unexpected error occurred");
    }
}
//# sourceMappingURL=login.js.map