package dev.ayushshah.threadverse.dto;

import lombok.Data;
import lombok.Builder;

@Builder
@Data
public class AuthenticationResponse {
    private String token;
    private UserDTO user;
}
