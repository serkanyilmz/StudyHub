package com.dropdatabase.studyhub.auth.application;


import com.dropdatabase.studyhub.auth.application.port.AuthCommandPort;
import com.dropdatabase.studyhub.auth.application.port.AuthQueryPort;

import com.dropdatabase.studyhub.auth.infra.exception.InvalidTokenException;
import com.dropdatabase.studyhub.auth.application.security.JwtTokenProvider;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;
import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;


@AllArgsConstructor
@Service
public class AuthQueryUseCase {
    private final AuthQueryPort authQueryPort;
    private final AuthCommandPort authCommandPort;
    private final JwtTokenProvider jwtTokenProvider;


    public boolean isTokenBlacklisted(String token) {
        try {
            String jti = jwtTokenProvider.getJti(token);
            return authQueryPort.isTokenBlacklisted(jti);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidTokenException("Malformed or invalid token", e);
        }
    }


    public boolean validateAccessToken(String token) {
        return jwtTokenProvider.validateSignature(token);
    }


    public boolean validateRefreshToken(String token) {
        return jwtTokenProvider.validateSignature(token);
    }


    public boolean shouldRefresh(String refreshToken) {
        Date expiration = jwtTokenProvider.getExpiry(refreshToken);
        Date now = new Date();

        // Yenileme eşiği 1 gün
        long refreshThresholdMillis = 24 * 60 * 60 * 1000;

        return (expiration.getTime() - now.getTime()) < refreshThresholdMillis;
    }

    public UserJpaEntity getLoggedInUser(String token) {
            String userId = jwtTokenProvider.getUserId(token);

            if (userId == null || userId.isEmpty()) {
                throw new InvalidTokenException("userId not found in token");
            }

            return authCommandPort.findById(userId);
        }

}
