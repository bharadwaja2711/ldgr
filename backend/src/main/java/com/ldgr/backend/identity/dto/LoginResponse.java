package com.ldgr.backend.identity.dto;

import java.util.UUID;

public record LoginResponse(
        UUID userId,
        String email,
        String accessToken,
        String refreshToken
) {
}
