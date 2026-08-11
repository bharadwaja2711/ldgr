export interface GoogleOAuthResult {
    userId: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}
export declare function waitForGoogleCallback(port: number): Promise<GoogleOAuthResult>;
//# sourceMappingURL=google-callback.d.ts.map