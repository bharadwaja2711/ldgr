import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { KeychainCredentialStore } from "../../core/auth/keychain-store.js";
import { waitForGoogleCallback } from "../oauth/google-callback.js";

const execFileAsync = promisify(execFile);
const API_BASE_URL = process.env.LDGR_API_URL ?? "http://localhost:8080";
const OAUTH_CALLBACK_PORT = 49152;

export async function googleLogin(): Promise<void> {
  try {
    const callbackPromise = waitForGoogleCallback(OAUTH_CALLBACK_PORT);
    const url = `${API_BASE_URL}/oauth2/authorization/google`;
    await execFileAsync("open", [url]);
    console.log("Opening Google sign-in in your browser...");
    const credentials = await callbackPromise;
    const credentialStore = new KeychainCredentialStore();
    await credentialStore.save({
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
    });
    console.log(`✓ Authenticated as ${credentials.email}`);
  } catch {
    console.error("✗ An unexpected error occurred");
  }
}