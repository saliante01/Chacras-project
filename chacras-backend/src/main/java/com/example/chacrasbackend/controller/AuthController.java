package com.example.chacrasbackend.controller;

import com.example.chacrasbackend.model.User;
import com.example.chacrasbackend.model.UserDTO;
import com.example.chacrasbackend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User newUser, HttpServletRequest request) {
        // 🔒 Si existe sesión, invalidarla para evitar cookie
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        // Validaciones básicas
        if (newUser.getEmail() == null || newUser.getPassword() == null || newUser.getName() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Faltan datos requeridos."));
        }

        // Evitar duplicados
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "El email ya está registrado."));
        }

        // Encriptar contraseña
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Guardar usuario
        userRepository.save(newUser);

        // ✅ Responder JSON válido (no texto plano)
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Usuario registrado exitosamente."));
    }

    @GetMapping("/user/current")
    public ResponseEntity<Object> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "No autenticado."));
        }

        User user = userRepository.findByEmail(authentication.getName());
        if (user != null) {
            return new ResponseEntity<>(new UserDTO(user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Sesión cerrada correctamente."));
    }


}
