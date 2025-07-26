package dev.ayushshah.threadverse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import jakarta.servlet.http.HttpServletResponse;

import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.repository.UserRepository;
import dev.ayushshah.threadverse.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;
    
    private final UserService userService;

    public UserController(UserService userService, UserRepository userRepository){
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication auth) {
        UserDTO user = (UserDTO) auth.getPrincipal();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication auth, HttpServletResponse res) {
        ResponseCookie cookie = ResponseCookie.from("token", "")       
        .httpOnly(true)
        // .secure(true)
        .path("/")
        .maxAge(0)
        .sameSite("Strict")
        .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String userId = ((UserDTO) auth.getPrincipal()).getId();

        return ResponseEntity.ok("User: " + userId + " has been logged out.");
        
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    
    


}


