package com.dropdatabase.studyhub.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.application.port.AuthQueryPort;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class AuthQueryJpaAdapter implements AuthQueryPort {
    private final UserJpaRepository userJpaRepository;
    private final TokenBlacklistJpaRepository tokenBlacklistJpaRepository;

    @Override
    public boolean isTokenBlacklisted(String jti) {
        return tokenBlacklistJpaRepository.existsById(jti);
    }




}
