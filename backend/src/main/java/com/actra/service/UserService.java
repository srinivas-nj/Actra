package com.actra.service;

import com.actra.model.Role;
import com.actra.model.UserEntity;
import com.actra.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity registerUser(String username, String email, String password, Role role) {
        if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Username or email already registered");
        }

        UserEntity entity = new UserEntity(username, email, passwordEncoder.encode(password), role);
        return userRepository.save(entity);
    }

    public Optional<UserEntity> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
