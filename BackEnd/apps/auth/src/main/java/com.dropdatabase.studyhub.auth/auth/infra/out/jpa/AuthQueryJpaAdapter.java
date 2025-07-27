package com.dropdatabase.studyhub.auth.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.auth.application.port.AuthQueryPort;
import com.dropdatabase.studyhub.auth.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.auth.infra.out.jpa.entity.UserJpaEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@AllArgsConstructor
@Component
public class AuthQueryJpaAdapter implements AuthQueryPort {
    private final UserJpaRepository userJpaRepository;
    private final TokenBlacklistJpaRepository tokenBlacklistJpaRepository;


    @Override
    public Optional<User> findByUsername(String username) {
        Optional<UserJpaEntity> entityOpt = userJpaRepository.findByUsername(username);
        return entityOpt.map(UserJpaEntity::toDomainEntity);
    }

    @Override
    public boolean isTokenBlacklisted(String jti) {
        return tokenBlacklistJpaRepository.existsById(jti);
    }
}
