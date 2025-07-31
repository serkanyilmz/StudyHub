package com.dropdatabase.studyhub.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.TokenBlacklistJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenBlacklistJpaRepository extends JpaRepository<TokenBlacklistJpaEntity, String> {
    boolean existsByJti(String jti);
}
