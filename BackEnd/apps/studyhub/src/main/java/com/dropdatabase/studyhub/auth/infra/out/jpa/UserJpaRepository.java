package com.dropdatabase.studyhub.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserJpaEntity, String> {
    Optional<UserJpaEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
