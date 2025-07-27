package dev.ayushshah.threadverse.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.dto.LoginRequest;
import dev.ayushshah.threadverse.dto.RegisterRequest;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.dto.AuthenticationResponse;
import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.mapper.UserMapper;


@Service
public class AuthService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserDTO register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new RuntimeException("Email Already Exists");
        }

        if (userRepository.existsByDisplayName(registerRequest.displayName())) {
            throw new RuntimeException("Display Name Already Exists");
        }

        User user = User.builder()
                .firstName(registerRequest.firstName())
                .lastName(registerRequest.lastName())
                .email(registerRequest.email())
                .displayName(registerRequest.displayName())
                .password(passwordEncoder.encode(registerRequest.password()))
                .build();

        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.email());

        User present_user = user.orElseThrow(() -> new RuntimeException(
                "Email Not Found"));

        if (!passwordEncoder.matches(loginRequest.password(), present_user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        UserDTO userDTO = userMapper.toDTO(present_user);

        Optional<String> token = JWTService.createToken(userDTO);

        String actual_token = token.orElseThrow(
                () -> new RuntimeException("Failed to create token"));

        AuthenticationResponse res = AuthenticationResponse.builder()
                .user(userDTO)
                .token(actual_token)
                .build();

        return res;
    }

}
