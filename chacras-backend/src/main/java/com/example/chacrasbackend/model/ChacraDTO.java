package com.example.chacrasbackend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChacraDTO {

    private Long id;
    private String nombre;
    private String ubicacion;
    private String imagenUrl; // ✅ ahora enviamos la ruta pública de la imagen
    private String usuarioEmail; // para mostrar el dueño de la chacra

    public ChacraDTO(Chacra chacra) {
        this.id = chacra.getId();
        this.nombre = chacra.getNombre();
        this.ubicacion = chacra.getUbicacion();
        this.imagenUrl = chacra.getImagenUrl();
        this.usuarioEmail = chacra.getUser() != null ? chacra.getUser().getEmail() : null;
    }
}
