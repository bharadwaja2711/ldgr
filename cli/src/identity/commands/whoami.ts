import { ApiClient, ApiError } from "../../core/api/client.js";
import { KeychainCredentialStore } from "../../core/auth/keychain-store.js";
import { IdentityApi } from "../api/identity-api.js";
import { IdentityService } from "../services/identity-service.js";

export async function whoami(): Promise<void> {
  const client = new ApiClient();
  const credentialStore = new KeychainCredentialStore();
  const identityApi = new IdentityApi(client);
  const identityService = new IdentityService(identityApi, credentialStore, client);

  try {
    const me = await identityService.whoami();
    console.log(`Email: ${me.email}`);
    console.log(`Status: ${me.status}`);
  } catch (error) {
    if (error instanceof Error && error.message === "Not authenticated") {
      console.error("✗ Not authenticated");
      return;
    }
    console.error("✗ An unexpected error occurred");
  }
}