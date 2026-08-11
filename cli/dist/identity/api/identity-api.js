import { ApiClient } from "../../core/api/client.js";
export class IdentityApi {
    client;
    constructor(client) {
        this.client = client;
    }
    async login(request) {
        return this.client.post("/api/v1/auth/login", request);
    }
    async me() {
        return this.client.get("/api/v1/security/me");
    }
    async register(request) {
        return this.client.post("/api/v1/auth/register", request);
    }
}
//# sourceMappingURL=identity-api.js.map