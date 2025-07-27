package dev.ayushshah.threadverse.dto;

import jakarta.validation.constraints.*;

import dev.ayushshah.threadverse.validation.ValidPassword;

@ValidPassword // custom class level annotation for validation
public record RegisterRequest (

    @NotBlank(message = "First name is required")
    String firstName,

    @NotBlank(message = "Last name is required")
    String lastName,

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    String email,

    @NotBlank(message = "Display name is required")
    String displayName,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password
) {}
