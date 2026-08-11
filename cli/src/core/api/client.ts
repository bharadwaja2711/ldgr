const API_BASE_URL =
    process.env.LDGR_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
      public readonly status: number,
      message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private accessToken: string | undefined;

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = undefined;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<TRequest, TResponse>(
      path: string,
      body: TRequest,
  ): Promise<TResponse> {
    return this.request<TResponse>("POST", path, body);
  }

  private async request<T>(
      method: string,
      path: string,
      body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        options,
    );

    const text = await response.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data
              ? String((data as { message: unknown }).message)
              : `Request failed with status ${response.status}`;

      throw new ApiError(response.status, message);
    }

    return data as T;
  }
}
