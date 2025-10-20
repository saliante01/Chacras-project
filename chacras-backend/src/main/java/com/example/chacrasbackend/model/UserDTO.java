package com.example.chacrasbackend.model;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String name;
    private String email;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }
}


