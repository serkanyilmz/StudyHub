package com.dropdatabase.studyhub.auth.infra.out.jpa;

import com.dropdatabase.studyhub.auth.application.port.AuthCommandPort;
import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.infra.exception.UserNotFoundException;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.TokenBlacklistJpaEntity;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

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

    @Override
    public Optional<User> findByUsername(String username) {
        Optional<UserJpaEntity> entityOpt = userJpaRepository.findByUsername(username);
        return entityOpt.map(UserJpaEntity::toDomainEntity);
    }

    @Override
    public UserJpaEntity findById(String id) {
        return userJpaRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

}

