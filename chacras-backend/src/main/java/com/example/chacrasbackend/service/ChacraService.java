package com.example.chacrasbackend.service;

import com.example.chacrasbackend.model.Chacra;
import com.example.chacrasbackend.model.User;
import com.example.chacrasbackend.repository.ChacraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChacraService {

    private final ChacraRepository chacraRepository;

    public List<Chacra> getAllChacras() {
        return chacraRepository.findAll();
    }

    public List<Chacra> getChacrasByUser(User user) {
        return chacraRepository.findByUser(user);
    }

    public Chacra createChacra(Chacra chacra) {
        return chacraRepository.save(chacra);
    }

    public Chacra updateChacra(Long id, Chacra updatedChacra) {
        Optional<Chacra> existingOpt = chacraRepository.findById(id);
        if (existingOpt.isPresent()) {
            Chacra existing = existingOpt.get();
            existing.setNombre(updatedChacra.getNombre());
            existing.setUbicacion(updatedChacra.getUbicacion());
            existing.setImagenUrl(updatedChacra.getImagenUrl());
            return chacraRepository.save(existing);
        }
        return null;
    }

    public void deleteChacra(Long id) {
        chacraRepository.deleteById(id);
    }
}


