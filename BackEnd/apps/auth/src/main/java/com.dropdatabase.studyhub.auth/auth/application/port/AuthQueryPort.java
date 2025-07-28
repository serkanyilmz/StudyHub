package com.dropdatabase.studyhub.auth.auth.application.port;


public interface AuthQueryPort {
    boolean isTokenBlacklisted(String jti);
}
