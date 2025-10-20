package com.example.chacrasbackend.repository;


import com.example.chacrasbackend.model.Chacra;
import com.example.chacrasbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChacraRepository extends JpaRepository<Chacra, Long> {
    List<Chacra> findByUser(User user);
}

