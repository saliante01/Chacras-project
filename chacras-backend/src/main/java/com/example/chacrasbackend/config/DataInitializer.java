package com.example.chacrasbackend.config;

import com.example.chacrasbackend.model.Role;
import com.example.chacrasbackend.model.User;
import com.example.chacrasbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {

            // Si no existe un admin, lo crea:
            if (userRepository.findByEmail("admin@chacras.cl") == null) {

                User admin = new User();
                admin.setEmail("admin@chacras.cl");
                admin.setName("Administrador");
                admin.setPassword(encoder.encode("admin123"));  //
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("🟢 ADMIN creado automáticamente: admin@chacras.cl");
            } else {
                System.out.println("ℹ️ ADMIN ya existe. No se creó uno nuevo.");
            }
        };
    }
}
