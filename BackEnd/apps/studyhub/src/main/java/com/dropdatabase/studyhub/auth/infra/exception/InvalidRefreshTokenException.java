package com.dropdatabase.studyhub.auth.infra.exception;

public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException() {
        super("Refresh token invalid");
    }

    public InvalidRefreshTokenException(String message) {
        super(message);
    }

    public InvalidRefreshTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
