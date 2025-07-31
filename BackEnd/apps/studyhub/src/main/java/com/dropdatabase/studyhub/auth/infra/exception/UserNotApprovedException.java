package com.dropdatabase.studyhub.auth.infra.exception;

public class UserNotApprovedException extends RuntimeException {
    public UserNotApprovedException() {
        super("User is not approved yet. Please wait for admin approval.");
    }

    public UserNotApprovedException(String message) {
        super(message);
    }

    public UserNotApprovedException(String message, Throwable cause) {
        super(message, cause);
    }
}
