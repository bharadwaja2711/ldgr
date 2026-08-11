import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
const SERVICE_NAME = "com.ldgr.cli";
const ACCOUNT_NAME = "default";
export class KeychainCredentialStore {
    async save(credentials) {
        const value = JSON.stringify(credentials);
        await execFileAsync("security", [
            "add-generic-password",
            "-U",
            "-s",
            SERVICE_NAME,
            "-a",
            ACCOUNT_NAME,
            "-w",
            value,
        ]);
    }
    async load() {
        try {
            const { stdout } = await execFileAsync("security", [
                "find-generic-password",
                "-s",
                SERVICE_NAME,
                "-a",
                ACCOUNT_NAME,
                "-w",
            ]);
            const credentials = JSON.parse(stdout.trim());
            if (typeof credentials.accessToken !== "string" ||
                typeof credentials.refreshToken !== "string") {
                throw new Error("Stored LDGR credentials are invalid");
            }
            return credentials;
        }
        catch (error) {
            if (isKeychainItemNotFound(error)) {
                return null;
            }
            throw error;
        }
    }
    async clear() {
        try {
            await execFileAsync("security", [
                "delete-generic-password",
                "-s",
                SERVICE_NAME,
                "-a",
                ACCOUNT_NAME,
            ]);
        }
        catch (error) {
            if (!isKeychainItemNotFound(error)) {
                throw error;
            }
        }
    }
}
function isKeychainItemNotFound(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 44);
}
//# sourceMappingURL=keychain-store.js.map