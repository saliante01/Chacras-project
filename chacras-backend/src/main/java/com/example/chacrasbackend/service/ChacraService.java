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

    // 🔹 Obtener TODAS las chacras (activas e inactivas) - por si la necesitás para administración
    public List<Chacra> getAllChacras() {
        return chacraRepository.findAll();
    }

    // 🔹 Obtener solo chacras ACTIVAS (para la vista pública)
    public List<Chacra> getAllActiveChacras() {
        return chacraRepository.findByActiveTrue();
    }

    // 🔹 Obtener chacras por usuario (todas, si alguna vez las necesitás)
    public List<Chacra> getChacrasByUser(User user) {
        return chacraRepository.findByUser(user);
    }

    // 🔹 Obtener solo chacras ACTIVAS de un usuario (para /mine)
    public List<Chacra> getActiveChacrasByUser(User user) {
        return chacraRepository.findByUserAndActiveTrue(user);
    }

    // 🔹 Crear o guardar chacra
    public Chacra createChacra(Chacra chacra) {
        return chacraRepository.save(chacra);
    }

    // 🔹 Actualizar chacra (sin modificar imagen si no se envía)
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

            // ⚠️ No tocamos el campo active acá
            return chacraRepository.save(existing);
        }
        return null;
    }

    // 🔥 BORRADO LÓGICO: marcar como inactive en vez de borrar
    public void deleteChacra(Long id) {
        Optional<Chacra> existingOpt = chacraRepository.findById(id);
        if (existingOpt.isPresent()) {
            Chacra existing = existingOpt.get();
            existing.setActive(false);      // 👈 acá está la magia
            chacraRepository.save(existing);
        }
    }

    // 🔹 Obtener chacra por ID (puede traer activa o inactiva)
    public Chacra getChacraById(Long id) {
        return chacraRepository.findById(id).orElse(null);
    }
}
