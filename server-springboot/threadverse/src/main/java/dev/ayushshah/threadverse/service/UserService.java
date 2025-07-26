package dev.ayushshah.threadverse.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.ayushshah.threadverse.mapper.UserMapper;
import dev.ayushshah.threadverse.model.User;
import dev.ayushshah.threadverse.dto.UserDTO;
import dev.ayushshah.threadverse.repository.UserRepository;

@Service
public class UserService {
    private UserMapper userMapper;
    private UserRepository userRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        return userMapper.toDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email Not Found"));

        return userMapper.toDTO(user);
    }

    public UserDTO getUserByDisplayName(String displayname) {
        User user = userRepository.findByDisplayName(displayname)
                .orElseThrow(() -> new RuntimeException("Display Name Not Found"));

        return userMapper.toDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(user -> userMapper.toDTO(user))
                .collect(Collectors.toList());
    }

}
