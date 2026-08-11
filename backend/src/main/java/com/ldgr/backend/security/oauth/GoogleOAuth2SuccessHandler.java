package com.ldgr.backend.security.oauth;

import com.ldgr.backend.identity.entity.User;
import com.ldgr.backend.identity.repository.UserRepository;
import com.ldgr.backend.security.jwt.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    @Value("${ldgr.security.oauth.cli-callback}")
    private String cliCallback;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String firstName = oauthUser.getAttribute("given_name");
        String lastName = oauthUser.getAttribute("family_name");

        if (email == null || email.isBlank()) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google account did not provide an email"
            );
            return;
        }

        final String normalizedEmail = email.trim().toLowerCase();
        final String resolvedFirstName =
                firstName != null ? firstName.trim() : "";
        final String resolvedLastName =
                lastName != null ? lastName.trim() : "";

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> {
                    User newUser = new User();

                    newUser.setEmail(normalizedEmail);
                    newUser.setFirstName(resolvedFirstName);
                    newUser.setLastName(resolvedLastName);
                    newUser.setPasswordHash(null);
                    newUser.setEmailVerified(true);
                    newUser.setStatus("ACTIVE");

                    return userRepository.save(newUser);
                });

        user.setEmailVerified(true);
        user.setLastLoginAt(OffsetDateTime.now());

        userRepository.save(user);

        String accessToken =
                jwtService.generateAccessToken(normalizedEmail);

        String refreshToken =
                jwtService.generateRefreshToken(normalizedEmail);

        String callbackUrl = UriComponentsBuilder
                .fromUriString(cliCallback)
                .queryParam("userId", user.getId())
                .queryParam("email", user.getEmail())
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(callbackUrl);
    }
}