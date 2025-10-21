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

    //  Obtener todas las chacras
    public List<Chacra> getAllChacras() {
        return chacraRepository.findAll();
    }

    //  Obtener chacras por usuario
    public List<Chacra> getChacrasByUser(User user) {
        return chacraRepository.findByUser(user);
    }

    //  Crear o guardar chacra
    public Chacra createChacra(Chacra chacra) {
        return chacraRepository.save(chacra);
    }

    //  Actualizar chacra (sin modificar imagen si no se envía)
    public Chacra updateChacra(Long id, Chacra updatedChacra) {
        Optional<Chacra> existingOpt = chacraRepository.findById(id);
        if (existingOpt.isPresent()) {
            Chacra existing = existingOpt.get();

            existing.setNombre(updatedChacra.getNombre());
            existing.setUbicacion(updatedChacra.getUbicacion());

            // ⚙️ Solo actualiza imagen si el campo no es null ni vacío
            if (updatedChacra.getImagenUrl() != null && !updatedChacra.getImagenUrl().isEmpty()) {
                existing.setImagenUrl(updatedChacra.getImagenUrl());
            }

            return chacraRepository.save(existing);
        }
        return null;
    }

    //  Eliminar chacra
    public void deleteChacra(Long id) {
        chacraRepository.deleteById(id);
    }

    //  Obtener chacra por ID
    public Chacra getChacraById(Long id) {
        return chacraRepository.findById(id).orElse(null);
    }
}
