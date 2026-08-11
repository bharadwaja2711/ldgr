export declare class ApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
export declare class ApiClient {
    private accessToken;
    setAccessToken(token: string): void;
    clearAccessToken(): void;
    get<T>(path: string): Promise<T>;
    post<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse>;
    private request;
}
//# sourceMappingURL=client.d.ts.map