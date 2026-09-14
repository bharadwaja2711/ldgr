package com.ldgr.backend.identity.controller;

import com.ldgr.backend.identity.dto.LoginRequest;
import com.ldgr.backend.identity.dto.LoginResponse;
import com.ldgr.backend.identity.dto.LogoutRequest;
import com.ldgr.backend.identity.dto.RefreshTokenRequest;
import com.ldgr.backend.identity.dto.RegisterRequest;
import com.ldgr.backend.identity.dto.RegisterResponse;
import com.ldgr.backend.identity.service.IdentityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class IdentityController {

    private final IdentityService identityService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return identityService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return identityService.login(request);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        return identityService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @Valid @RequestBody LogoutRequest request
    ) {
        identityService.logout(request.refreshToken());
    }
}
