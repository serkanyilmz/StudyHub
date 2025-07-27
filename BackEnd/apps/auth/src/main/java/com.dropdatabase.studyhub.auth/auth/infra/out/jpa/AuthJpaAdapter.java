package com.dropdatabase.studyhub.auth.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.auth.application.port.AuthCommandPort;
import com.dropdatabase.studyhub.auth.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.auth.infra.out.jpa.entity.TokenBlacklistJpaEntity;
import com.dropdatabase.studyhub.auth.auth.infra.out.jpa.entity.UserJpaEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@AllArgsConstructor
@Component
public class AuthJpaAdapter implements AuthCommandPort {
    private final TokenBlacklistJpaRepository tokenBlacklistJpaRepository;
    private final UserJpaRepository userJpaRepository;


    @Override
    @Transactional
    public void blacklistRefreshToken(String jti, Date expiryDate) {
        TokenBlacklistJpaEntity entity = new TokenBlacklistJpaEntity(jti, expiryDate);
        tokenBlacklistJpaRepository.save(entity);
    }

    @Override
    public void save(User user) {
            userJpaRepository.save(new UserJpaEntity(user));
    }

}

