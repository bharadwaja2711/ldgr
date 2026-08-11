export interface Credentials {
  accessToken: string;
  refreshToken: string;
}

export interface CredentialStore {
  save(credentials: Credentials): Promise<void>;
  load(): Promise<Credentials | null>;
  clear(): Promise<void>;
}
