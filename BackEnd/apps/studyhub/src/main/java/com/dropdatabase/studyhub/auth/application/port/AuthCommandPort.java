package com.dropdatabase.studyhub.auth.application.port;

import com.dropdatabase.studyhub.auth.domain.model.User;

import java.util.Date;
import java.util.Optional;

public interface AuthCommandPort {
    void blacklistRefreshToken(String jti, Date expiryDate);
    void save(User user);
    Optional<User> findByUsername(String username);

}
