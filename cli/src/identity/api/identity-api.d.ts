import { ApiClient } from "../../core/api/client.js";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, MeResponse } from "../models/auth.js";
export declare class IdentityApi {
    private readonly client;
    constructor(client: ApiClient);
    login(request: LoginRequest): Promise<LoginResponse>;
    me(): Promise<MeResponse>;
    register(request: RegisterRequest): Promise<RegisterResponse>;
}
//# sourceMappingURL=identity-api.d.ts.map