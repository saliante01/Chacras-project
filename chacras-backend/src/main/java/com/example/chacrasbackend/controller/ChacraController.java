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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chacras")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChacraController {

    private final ChacraService chacraService;
    private final UserRepository userRepository;


    @GetMapping("/public")
    public ResponseEntity<List<ChacraDTO>> getAllChacras() {
        List<ChacraDTO> chacras = chacraService.getAllChacras()
                .stream()
                .map(ChacraDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(chacras, HttpStatus.OK);
    }


    @GetMapping("/mine")
    public ResponseEntity<List<ChacraDTO>> getMyChacras(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        List<ChacraDTO> chacras = chacraService.getChacrasByUser(user)
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
            if (existing == null) {
                return new ResponseEntity<>("Chacra no encontrada", HttpStatus.NOT_FOUND);
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));
            boolean isOwner = existing.getUser() != null && existing.getUser().getEmail().equals(user.getEmail());

            if (!isAdmin && !isOwner) {
                return new ResponseEntity<>("No autorizado para actualizar esta chacra", HttpStatus.FORBIDDEN);
            }

            // ✅ Actualizar solo los campos presentes
            if (nombre != null && !nombre.isEmpty()) {
                existing.setNombre(nombre);
            }
            if (ubicacion != null && !ubicacion.isEmpty()) {
                existing.setUbicacion(ubicacion);
            }

            // 📸 Si se envía una imagen, la guardamos
            if (file != null && !file.isEmpty()) {
                String uploadDir = "uploads/chacras/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = "chacra_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                existing.setImagenUrl("/uploads/chacras/" + fileName);
            }

            Chacra updated = chacraService.createChacra(existing);
            return new ResponseEntity<>(new ChacraDTO(updated), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar chacra: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteChacra(@PathVariable Long id,
                                               Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Chacra existing = chacraService.getAllChacras().stream()
                .filter(c -> c.getId().equals(id) &&
                        c.getUser() != null &&
                        c.getUser().getEmail().equals(user.getEmail()))
                .findFirst()
                .orElse(null);

        if (existing == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        chacraService.deleteChacra(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PostMapping("/{id}/imagen")
    public ResponseEntity<Object> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            User user = userRepository.findByEmail(authentication.getName());
            if (user == null) {
                return new ResponseEntity<>("Usuario no autenticado", HttpStatus.FORBIDDEN);
            }

            Chacra chacra = chacraService.getChacraById(id);
            if (chacra == null) {
                return new ResponseEntity<>("Chacra no encontrada", HttpStatus.NOT_FOUND);
            }

            boolean esAdmin = user.getEmail().equals("admin@chacras.cl");
            boolean esDueno = chacra.getUser() != null && chacra.getUser().getEmail().equals(user.getEmail());
            if (!esAdmin && !esDueno) {
                return new ResponseEntity<>("No autorizado para modificar esta chacra", HttpStatus.UNAUTHORIZED);
            }

            // 📁 Guardar nueva imagen
            String uploadDir = "uploads/chacras/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = "chacra_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            chacra.setImagenUrl("/uploads/chacras/" + fileName);
            chacraService.createChacra(chacra);

            return new ResponseEntity<>("Imagen subida correctamente", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al subir imagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/admin/create")
    public ResponseEntity<Object> createChacraForUser(
            @RequestParam("nombre") String nombre,
            @RequestParam("ubicacion") String ubicacion,
            @RequestParam("userEmail") String userEmail,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {

        try {
            // 🧠 Verificamos que el usuario autenticado sea admin
            boolean isAdmin = authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));

            if (!isAdmin) {
                return new ResponseEntity<>("No autorizado. Solo administradores pueden crear chacras para otros usuarios.", HttpStatus.FORBIDDEN);
            }

            // 🔍 Buscamos al usuario destino
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                return new ResponseEntity<>("Usuario no encontrado con email: " + userEmail, HttpStatus.NOT_FOUND);
            }

            // 📁 Si hay imagen, la guardamos
            String imagenUrl = null;
            if (file != null && !file.isEmpty()) {
                String uploadDir = "uploads/chacras/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = "chacra_admin_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                imagenUrl = "/uploads/chacras/" + fileName;
            }

            // 🧱 Crear la nueva chacra
            Chacra chacra = new Chacra();
            chacra.setNombre(nombre);
            chacra.setUbicacion(ubicacion);
            chacra.setUser(user);
            chacra.setImagenUrl(imagenUrl != null ? imagenUrl : "");

            Chacra savedChacra = chacraService.createChacra(chacra);

            return new ResponseEntity<>(new ChacraDTO(savedChacra), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear chacra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
