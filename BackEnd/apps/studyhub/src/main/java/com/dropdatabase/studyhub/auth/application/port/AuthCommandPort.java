package com.dropdatabase.studyhub.auth.application.port;

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;

import java.util.Date;
import java.util.Optional;

public interface AuthCommandPort {
    void blacklistRefreshToken(String jti, Date expiryDate);
    void save(User user);
    Optional<User> findByUsername(String username);
    UserJpaEntity findById(String id);
}
