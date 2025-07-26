package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import dev.ayushshah.threadverse.service.AuthService;
import dev.ayushshah.threadverse.dto.LoginRequest;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.dto.AuthenticationResponse;
import dev.ayushshah.threadverse.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            AuthenticationResponse authResponse = authService.login(loginRequest);

            // send the token in a httpCookie
            ResponseCookie cookie = ResponseCookie.from("token", authResponse.getToken())
                    .httpOnly(true)
                    // .secure(true)
                    .path("/")
                    .maxAge(10 * 60 * 60)
                    .sameSite("Strict")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(authResponse.getUser());

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserDTO userDTO = authService.register(registerRequest);
        return ResponseEntity.ok(userDTO);
    }

}
