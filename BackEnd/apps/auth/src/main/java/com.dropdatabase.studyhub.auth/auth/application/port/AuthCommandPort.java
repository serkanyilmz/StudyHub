package com.dropdatabase.studyhub.auth.auth.application.port;

import com.dropdatabase.studyhub.auth.auth.domain.model.User;

import java.util.Date;

public interface AuthCommandPort {
    void blacklistRefreshToken(String jti, Date expiryDate);
    void save(User user);

}
