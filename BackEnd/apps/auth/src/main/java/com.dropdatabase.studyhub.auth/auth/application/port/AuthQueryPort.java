package com.dropdatabase.studyhub.auth.auth.application.port;


import com.dropdatabase.studyhub.auth.auth.domain.model.User;

import java.util.Optional;

public interface AuthQueryPort {
    Optional<User> findByUsername(String username);
    boolean isTokenBlacklisted(String jti);
}
