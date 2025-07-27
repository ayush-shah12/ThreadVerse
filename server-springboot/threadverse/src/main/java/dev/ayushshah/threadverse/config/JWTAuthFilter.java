package dev.ayushshah.threadverse.config;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.lang.NonNull;

import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.service.JWTService;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.mapper.UserMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public JWTAuthFilter(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req, @NonNull HttpServletResponse res,
            @NonNull FilterChain chain) throws ServletException, IOException {

        String token = null;

        if (req.getCookies() != null) {
            for (Cookie cookie : req.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            try {
                Optional<String> userIdOpt = JWTService.verifyToken(token);

                if (userIdOpt.isPresent()) {
                    String userId = userIdOpt.get();

                    User user = userRepository.findById(userId)
                            .orElse(null);

                    if (user != null) {
                        UserDTO userDTO = userMapper.toDTO(user);

                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDTO,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                System.out.println("JWT Auth Failed Due To Exception: " + e.getMessage());
            }
        }

        // continue filter chain regardless of token status
        chain.doFilter(req, res);
    }

}
