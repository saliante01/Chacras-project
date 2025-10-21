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
    public ResponseEntity<ChacraDTO> updateChacra(@PathVariable Long id,
                                                  @RequestBody Chacra updatedChacra,
                                                  Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Chacra existing = chacraService.getAllChacras().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (existing == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !existing.getUser().getEmail().equals(user.getEmail())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Chacra updated = chacraService.updateChacra(id, updatedChacra);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ChacraDTO(updated), HttpStatus.OK);
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
}
