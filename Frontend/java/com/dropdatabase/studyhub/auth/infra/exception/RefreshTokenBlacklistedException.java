package com.dropdatabase.studyhub.auth.infra.exception;

public class RefreshTokenBlacklistedException extends RuntimeException {
    public RefreshTokenBlacklistedException() {
        super("Refresh token is blacklisted");
    }

    public RefreshTokenBlacklistedException(String message) {
        super(message);
    }

    public RefreshTokenBlacklistedException(String message, Throwable cause) {
        super(message, cause);
    }
}
