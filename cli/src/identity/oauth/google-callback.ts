import { createServer } from "node:http";

export interface GoogleOAuthResult {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export function waitForGoogleCallback(
  port: number,
): Promise<GoogleOAuthResult> {
  return new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      const url = new URL(
        request.url ?? "/",
        `http://127.0.0.1:${port}`,
      );

      if (url.pathname !== "/oauth/callback") {
        response.statusCode = 404;
        response.end();
        return;
      }

      const accessToken = url.searchParams.get("accessToken");
      const refreshToken = url.searchParams.get("refreshToken");
      const userId = url.searchParams.get("userId");
      const email = url.searchParams.get("email");

      if (!accessToken || !refreshToken || !userId || !email) {
        response.statusCode = 400;
        response.end("Missing OAuth credentials.");
        server.close();
        reject(new Error("Invalid OAuth callback"));
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.end(
        "<h2>LDGR authentication successful.</h2><p>You can close this window.</p>",
      );

      server.close();

      resolve({
        userId,
        email,
        accessToken,
        refreshToken,
      });
    });

    server.on("error", reject);
    server.listen(port, "127.0.0.1");
  });
}
