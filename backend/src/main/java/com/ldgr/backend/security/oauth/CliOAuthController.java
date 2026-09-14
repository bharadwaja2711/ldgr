package com.ldgr.backend.security.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class CliOAuthController {

    public static final String CLI_OAUTH_SESSION_ATTRIBUTE =
            "LDGR_CLI_OAUTH";

    public static final String WEB_OAUTH_SESSION_ATTRIBUTE =
            "LDGR_WEB_OAUTH";

    @GetMapping("/api/v1/auth/google/cli")
    public void startCliGoogleLogin(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        request.getSession(true).setAttribute(
                CLI_OAUTH_SESSION_ATTRIBUTE,
                true
        );

        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/api/v1/auth/google/web")
    public void startWebGoogleLogin(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        request.getSession(true).setAttribute(
                WEB_OAUTH_SESSION_ATTRIBUTE,
                true
        );

        response.sendRedirect("/oauth2/authorization/google");
    }
}
