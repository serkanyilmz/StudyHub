package com.dropdatabase.studyhub.auth.application.port;


public interface AuthQueryPort {
    boolean isTokenBlacklisted(String jti);
}
