package com.actra.api.controller;

import com.actra.model.Role;
import com.actra.model.UserEntity;
import com.actra.security.JwtService;
import com.actra.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserEntity user = userService.registerUser(request.username(), request.email(), request.password(), request.role());
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        if (authentication.isAuthenticated()) {
            UserEntity user = userService.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.username()));
            String token = jwtService.generateToken(request.username());
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
        }

        return ResponseEntity.status(401).build();
    }

    public record RegisterRequest(
        @NotBlank String username,
        @NotBlank @Email String email,
        @NotBlank String password,
        Role role
    ) {}

    public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
    ) {}

    public record AuthResponse(
        String token,
        String username,
        String role
    ) {}
}
