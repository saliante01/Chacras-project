package com.example.chacrasbackend.model;

import lombok.Data;

@Data
public class ChacraDTO {

    private Long id;
    private String nombre;
    private String ubicacion;
    private String imagenUrl;
    private String propietarioEmail;

    public ChacraDTO(Chacra chacra) {
        this.id = chacra.getId();
        this.nombre = chacra.getNombre();
        this.ubicacion = chacra.getUbicacion();
        this.imagenUrl = chacra.getImagenUrl();
        this.propietarioEmail =
                chacra.getUser() != null ? chacra.getUser().getEmail() : null;
    }
}

