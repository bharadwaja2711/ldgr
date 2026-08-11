const API_BASE_URL = process.env.LDGR_API_URL ?? "http://localhost:8080";
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
export class ApiClient {
    accessToken;
    setAccessToken(token) {
        this.accessToken = token;
    }
    clearAccessToken() {
        this.accessToken = undefined;
    }
    async get(path) {
        return this.request("GET", path);
    }
    async post(path, body) {
        return this.request("POST", path, body);
    }
    async request(method, path, body) {
        const headers = {
            Accept: "application/json",
        };
        if (body !== undefined) {
            headers["Content-Type"] = "application/json";
        }
        if (this.accessToken) {
            headers["Authorization"] = `Bearer ${this.accessToken}`;
        }
        const options = {
            method,
            headers,
        };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }
        console.error("API DEBUG:", {
            method,
            path,
            url: `${API_BASE_URL}${path}`,
            hasAccessToken: Boolean(this.accessToken),
            body,
        });
        const response = await fetch(`${API_BASE_URL}${path}`, options);
        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : undefined;
        }
        catch {
            data = text;
        }
        if (!response.ok) {
            const message = typeof data === "object" &&
                data !== null &&
                "message" in data
                ? String(data.message)
                : `Request failed with status ${response.status}`;
            throw new ApiError(response.status, message);
        }
        return data;
    }
}
//# sourceMappingURL=client.js.map