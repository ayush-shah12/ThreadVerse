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
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email Already Exists");
        }

        if (userRepository.existsByDisplayName(registerRequest.getDisplayName())) {
            throw new RuntimeException("Display Name Already Exists");
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .displayName(registerRequest.getDisplayName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        User present_user = user.orElseThrow(() -> new RuntimeException(
                "Email Not Found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), present_user.getPassword())) {
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
