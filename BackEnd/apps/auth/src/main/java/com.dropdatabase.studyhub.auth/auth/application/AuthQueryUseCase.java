package com.dropdatabase.studyhub.auth.auth.application;


import com.dropdatabase.studyhub.auth.auth.application.port.AuthQueryPort;

import com.dropdatabase.studyhub.auth.auth.infra.exception.InvalidTokenException;
import com.dropdatabase.studyhub.auth.auth.application.security.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;


@AllArgsConstructor
@Service
public class AuthQueryUseCase {
    private final AuthQueryPort authQueryPort;
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



}
