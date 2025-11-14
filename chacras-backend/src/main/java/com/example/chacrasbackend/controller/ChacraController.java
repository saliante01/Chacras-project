package com.example.chacrasbackend.controller;

import com.example.chacrasbackend.model.Chacra;
import com.example.chacrasbackend.model.ChacraDTO;
import com.example.chacrasbackend.model.User;
import com.example.chacrasbackend.repository.UserRepository;
import com.example.chacrasbackend.service.ChacraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chacras")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChacraController {

    private final ChacraService chacraService;
    private final UserRepository userRepository;


    // 📌 LISTA PÚBLICA: SOLO MOSTRAR CHACRAS ACTIVAS
    @GetMapping("/public")
    public ResponseEntity<List<ChacraDTO>> getAllChacras() {
        List<ChacraDTO> chacras = chacraService.getAllActiveChacras()
                .stream()
                .map(ChacraDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(chacras, HttpStatus.OK);
    }


    // 📌 MIS CHACRAS: SOLO ACTIVAS DEL USUARIO LOGUEADO
    @GetMapping("/mine")
    public ResponseEntity<List<ChacraDTO>> getMyChacras(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<ChacraDTO> chacras = chacraService.getActiveChacrasByUser(user)
                .stream()
                .map(ChacraDTO::new)
                .collect(Collectors.toList());

        return new ResponseEntity<>(chacras, HttpStatus.OK);
    }


    @PostMapping("/full")
    public ResponseEntity<Object> createChacraWithImage(
            @RequestParam("nombre") String nombre,
            @RequestParam("ubicacion") String ubicacion,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            User user = userRepository.findByEmail(authentication.getName());
            if (user == null) {
                return new ResponseEntity<>("Usuario no autenticado", HttpStatus.FORBIDDEN);
            }

            String uploadDir = "uploads/chacras/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = "chacra_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Chacra chacra = new Chacra();
            chacra.setNombre(nombre);
            chacra.setUbicacion(ubicacion);
            chacra.setUser(user);
            chacra.setActive(true); // 👈 SIEMPRE ACTIVA AL CREAR
            chacra.setImagenUrl("/uploads/chacras/" + fileName);

            Chacra savedChacra = chacraService.createChacra(chacra);

            return new ResponseEntity<>(new ChacraDTO(savedChacra), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear la chacra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateChacraFlexible(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String ubicacion,
            @RequestParam(required = false) MultipartFile file,
            Authentication authentication) {

        try {
            User user = userRepository.findByEmail(authentication.getName());
            if (user == null) {
                return new ResponseEntity<>("Usuario no autenticado", HttpStatus.FORBIDDEN);
            }

            Chacra existing = chacraService.getChacraById(id);
            if (existing == null || !existing.getActive()) {
                return new ResponseEntity<>("Chacra no encontrada o desactivada", HttpStatus.NOT_FOUND);
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));
            boolean isOwner = existing.getUser() != null && existing.getUser().getEmail().equals(user.getEmail());

            if (!isAdmin && !isOwner) {
                return new ResponseEntity<>("No autorizado para actualizar esta chacra", HttpStatus.FORBIDDEN);
            }

            if (nombre != null && !nombre.isEmpty()) existing.setNombre(nombre);
            if (ubicacion != null && !ubicacion.isEmpty()) existing.setUbicacion(ubicacion);

            if (file != null && !file.isEmpty()) {
                String uploadDir = "uploads/chacras/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

                String fileName = "chacra_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                existing.setImagenUrl("/uploads/chacras/" + fileName);
            }

            Chacra updated = chacraService.createChacra(existing);
            return new ResponseEntity<>(new ChacraDTO(updated), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar chacra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 🚨 AHORA BORRADO LÓGICO
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteChacra(@PathVariable Long id,
                                               Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        Chacra existing = chacraService.getChacraById(id);
        if (existing == null || !existing.getActive()) {
            return new ResponseEntity<>("Chacra no encontrada", HttpStatus.NOT_FOUND);
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        boolean isOwner = existing.getUser() != null &&
                existing.getUser().getEmail().equals(user.getEmail());

        if (!isAdmin && !isOwner) {
            return new ResponseEntity<>("No autorizado", HttpStatus.UNAUTHORIZED);
        }

        // 🔥 BORRADO LÓGICO
        existing.setActive(false);
        chacraService.createChacra(existing);

        return new ResponseEntity<>(Map.of("message", "Chacra eliminada lógicamente"), HttpStatus.OK);
    }
    // 📌 ADMIN: ver todas las chacras (activas e inactivas)
    @GetMapping("/admin/all")
    public ResponseEntity<List<ChacraDTO>> getAllChacrasAdmin() {
        List<ChacraDTO> chacras = chacraService.getAllChacras()
                .stream()
                .map(ChacraDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(chacras, HttpStatus.OK);
    }



}
