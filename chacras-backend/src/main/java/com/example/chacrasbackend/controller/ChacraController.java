package com.example.chacrasbackend.controller;


import com.example.chacrasbackend.model.Chacra;
import com.example.chacrasbackend.model.ChacraDTO;
import com.example.chacrasbackend.model.User;
import com.example.chacrasbackend.model.UserDTO;
import com.example.chacrasbackend.repository.UserRepository;
import com.example.chacrasbackend.service.ChacraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping
    public ResponseEntity<ChacraDTO> createChacra(@RequestBody Chacra chacra,
                                                  Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        chacra.setUser(user);
        Chacra newChacra = chacraService.createChacra(chacra);
        return new ResponseEntity<>(new ChacraDTO(newChacra), HttpStatus.CREATED);
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
}

