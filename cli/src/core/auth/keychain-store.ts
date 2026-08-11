import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { Credentials, CredentialStore } from "./credentials.js";

const execFileAsync = promisify(execFile);

const SERVICE_NAME = "com.ldgr.cli";
const ACCOUNT_NAME = "default";

export class KeychainCredentialStore implements CredentialStore {
    async save(credentials: Credentials): Promise<void> {
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

    async load(): Promise<Credentials | null> {
        try {
            const { stdout } = await execFileAsync("security", [
                "find-generic-password",
                "-s",
                SERVICE_NAME,
                "-a",
                ACCOUNT_NAME,
                "-w",
            ]);

            const credentials = JSON.parse(stdout.trim()) as Credentials;

            if (
                typeof credentials.accessToken !== "string" ||
                typeof credentials.refreshToken !== "string"
            ) {
                throw new Error("Stored LDGR credentials are invalid");
            }

            return credentials;
        } catch (error: unknown) {
            if (isKeychainItemNotFound(error)) {
                return null;
            }

            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await execFileAsync("security", [
                "delete-generic-password",
                "-s",
                SERVICE_NAME,
                "-a",
                ACCOUNT_NAME,
            ]);
        } catch (error: unknown) {
            if (!isKeychainItemNotFound(error)) {
                throw error;
            }
        }
    }
}

function isKeychainItemNotFound(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: unknown }).code === 44
    );
}