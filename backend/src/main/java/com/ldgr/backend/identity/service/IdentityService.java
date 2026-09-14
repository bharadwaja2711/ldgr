package com.ldgr.backend.identity.service;

import com.ldgr.backend.identity.dto.LoginRequest;
import com.ldgr.backend.identity.dto.LoginResponse;
import com.ldgr.backend.identity.dto.RegisterRequest;
import com.ldgr.backend.identity.dto.RegisterResponse;
import com.ldgr.backend.identity.entity.RefreshToken;
import com.ldgr.backend.identity.entity.User;
import com.ldgr.backend.identity.repository.RefreshTokenRepository;
import com.ldgr.backend.identity.repository.UserRepository;
import com.ldgr.backend.security.TokenHashService;
import com.ldgr.backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final TokenHashService tokenHashService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        User savedUser = userRepository.save(user);
        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName()
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);
        return createTokenResponse(user);
    }

    @Transactional
    public LoginResponse refresh(String rawRefreshToken) {

        // Reject malformed or expired tokens
        if (!jwtService.isValid(rawRefreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        // Reject access tokens presented at the refresh endpoint
        if (!jwtService.isRefreshToken(rawRefreshToken)) {
            throw new IllegalArgumentException("Token is not a refresh token");
        }

        String tokenHash = tokenHashService.hashToken(rawRefreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (storedToken.getRevokedAt() != null) {
            throw new IllegalArgumentException("Refresh token has been revoked");
        }

        if (storedToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        User user = userRepository.findById(storedToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalArgumentException("User account is not active");
        }

        storedToken.setRevokedAt(OffsetDateTime.now());
        refreshTokenRepository.save(storedToken);

        return createTokenResponse(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        String tokenHash = tokenHashService.hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash)
                .ifPresent(token -> {
                    if (token.getRevokedAt() == null) {
                        token.setRevokedAt(OffsetDateTime.now());
                        refreshTokenRepository.save(token);
                    }
                });
    }

    private LoginResponse createTokenResponse(User user) {
        String accessToken  = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken storedToken = new RefreshToken();
        storedToken.setUserId(user.getId());
        storedToken.setTokenHash(tokenHashService.hashToken(refreshToken));
        storedToken.setExpiresAt(
                jwtService.extractExpiration(refreshToken)
                        .toInstant()
                        .atOffset(java.time.ZoneOffset.UTC)
        );
        refreshTokenRepository.save(storedToken);

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                accessToken,
                refreshToken
        );
    }
}
