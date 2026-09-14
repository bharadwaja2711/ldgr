package com.ldgr.backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private static final String CLAIM_TOKEN_TYPE = "typ";
    private static final String TYPE_ACCESS = "ACCESS";
    private static final String TYPE_REFRESH = "REFRESH";

    private final SecretKey signingKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(
            @Value("${ldgr.security.jwt.secret}") String secret,
            @Value("${ldgr.security.jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${ldgr.security.jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        this.signingKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(String email) {
        return generateToken(email, accessTokenExpiration, TYPE_ACCESS);
    }

    public String generateRefreshToken(String email) {
        return generateToken(email, refreshTokenExpiration, TYPE_REFRESH);
    }

    public Date extractExpiration(String token) {
        return parseClaims(token).getExpiration();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            return TYPE_REFRESH.equals(
                    parseClaims(token).get(CLAIM_TOKEN_TYPE, String.class)
            );
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isAccessToken(String token) {
        try {
            return TYPE_ACCESS.equals(
                    parseClaims(token).get(CLAIM_TOKEN_TYPE, String.class)
            );
        } catch (Exception e) {
            return false;
        }
    }

    private String generateToken(
            String subject,
            long expiration,
            String tokenType
    ) {
        Date issuedAt = new Date();
        Date expiresAt = new Date(
                issuedAt.getTime() + expiration
        );

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(subject)
                .issuedAt(issuedAt)
                .expiration(expiresAt)
                .claim(CLAIM_TOKEN_TYPE, tokenType)
                .signWith(signingKey)
                .compact();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
