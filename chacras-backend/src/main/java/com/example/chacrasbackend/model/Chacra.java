package com.example.chacrasbackend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chacra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String ubicacion;
    private String imagenUrl; // simularemos imagen con texto o URL


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    public Chacra(String nombre, String ubicacion, String imagenUrl, User user) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.imagenUrl = imagenUrl;
        this.user = user;
    }
}


