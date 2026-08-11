import type { Credentials, CredentialStore } from "./credentials.js";
export declare class KeychainCredentialStore implements CredentialStore {
    save(credentials: Credentials): Promise<void>;
    load(): Promise<Credentials | null>;
    clear(): Promise<void>;
}
//# sourceMappingURL=keychain-store.d.ts.map