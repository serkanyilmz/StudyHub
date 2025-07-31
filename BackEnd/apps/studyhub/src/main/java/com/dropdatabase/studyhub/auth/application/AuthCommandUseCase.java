package com.dropdatabase.studyhub.auth.application;

import com.dropdatabase.studyhub.auth.application.command.LoginResponseCommand;
import com.dropdatabase.studyhub.auth.application.command.TokensCommand;
import com.dropdatabase.studyhub.auth.application.port.AuthCommandPort;
import com.dropdatabase.studyhub.auth.domain.model.Role;
import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.infra.exception.InvalidCredentialsException;
import com.dropdatabase.studyhub.auth.infra.exception.InvalidRefreshTokenException;
import com.dropdatabase.studyhub.auth.infra.exception.UserNotApprovedException;
import com.dropdatabase.studyhub.auth.infra.exception.UserNotFoundException;
import com.dropdatabase.studyhub.auth.application.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


import java.util.Date;


@Service
public class AuthCommandUseCase {

    private final AuthCommandPort authCommandPort;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthQueryUseCase authQueryUseCase;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthCommandUseCase(PasswordEncoder passwordEncoder, AuthQueryUseCase authQueryUseCase, AuthCommandPort authCommandPort, JwtTokenProvider jwtTokenProvider) {
        this.passwordEncoder = passwordEncoder;
        this.authQueryUseCase = authQueryUseCase;
        this.authCommandPort = authCommandPort;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponseCommand login(String username, String password) {
        User user = authCommandPort.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        if (!user.isApproved()) {
            throw new UserNotApprovedException();
        }

        String access = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getRole().toString());
        String refresh = jwtTokenProvider.generateRefreshToken(user.getUsername());

        return new LoginResponseCommand(access, refresh);
    }

    public void register(String username, String password, String fullName, Role role) {
        boolean needsApproval = false;

        User user = new User(
                username,
                passwordEncoder.encode(password),
                fullName,
                role,
                LocalDateTime.now(),
                null,
                !needsApproval
        );

        authCommandPort.save(user);
    }

    public void blacklistRefreshToken(String token) {
        String jti = jwtTokenProvider.getJti(token);
        Date expiry = jwtTokenProvider.getExpiry(token);
        authCommandPort.blacklistRefreshToken(jti, expiry);
    }

    public TokensCommand refreshTokens(String refreshToken) {
        if (!authQueryUseCase.validateRefreshToken(refreshToken)) {
            throw new InvalidRefreshTokenException();
        }

        String username = jwtTokenProvider.getUsername(refreshToken);
        User user = authCommandPort.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getRole().toString());

        if (authQueryUseCase.shouldRefresh(refreshToken)) {
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());
            return new TokensCommand(newAccessToken, newRefreshToken);
        }

        return new TokensCommand(newAccessToken, refreshToken);
    }



}
