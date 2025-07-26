package dev.ayushshah.threadverse.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import jakarta.validation.constraints.*;

import dev.ayushshah.threadverse.validation.ValidPassword;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ValidPassword // custom class level annotation for validation
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Display name is required")
    private String displayName;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
