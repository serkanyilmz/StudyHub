package com.dropdatabase.studyhub.auth.auth.infra.inp.web.controller;


import com.dropdatabase.studyhub.auth.auth.application.AuthCommandUseCase;
import com.dropdatabase.studyhub.auth.auth.application.AuthQueryUseCase;
import com.dropdatabase.studyhub.auth.auth.application.command.LoginRequestCommand;
import com.dropdatabase.studyhub.auth.auth.application.command.LoginResponseCommand;
import com.dropdatabase.studyhub.auth.auth.application.command.RegisterRequestCommand;
import com.dropdatabase.studyhub.auth.auth.application.command.TokensCommand;
import com.dropdatabase.studyhub.auth.auth.domain.model.Role;
import com.dropdatabase.studyhub.auth.auth.infra.exception.RefreshTokenBlacklistedException;
import com.dropdatabase.studyhub.auth.auth.infra.exception.InvalidAccessTokenException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthCommandController {
    private final AuthCommandUseCase authCommandUseCase;
    private final AuthQueryUseCase authQueryUseCase;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseCommand> login(@RequestBody LoginRequestCommand request) {
        LoginResponseCommand loginResponse = authCommandUseCase.login(request.username(), request.password());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<String> register(@RequestBody RegisterRequestCommand request) {
        authCommandUseCase.register(request.username(), request.password(), request.fullName(), request.role());

        boolean needsApproval = request.role() == Role.TEACHER || request.role() == Role.WRITER;

        if (needsApproval) {
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Registration successful, awaiting admin approval.");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration successful.");
    }



    @PostMapping("/validate-access")
    public ResponseEntity<Void> validateAccess(@RequestBody TokensCommand tokens) {
        String refreshToken = tokens.refreshToken();
        String accessToken = tokens.accessToken();

        if (!authQueryUseCase.validateAccessToken(accessToken)) {
            throw new InvalidAccessTokenException();
        }

        // Front-End'de refresh token isteği atmadan log out olmak için
        if (authQueryUseCase.isTokenBlacklisted(refreshToken)) {
            throw new RefreshTokenBlacklistedException();
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-access")
    public ResponseEntity<TokensCommand> refreshAccess(@RequestBody TokensCommand tokens) {
        String refreshToken = tokens.refreshToken();

        if (authQueryUseCase.isTokenBlacklisted(refreshToken)) {
            throw new RefreshTokenBlacklistedException();
        }

        TokensCommand newTokens = authCommandUseCase.refreshTokens(refreshToken);
        return ResponseEntity.ok(newTokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody TokensCommand tokens) {
        authCommandUseCase.blacklistRefreshToken(tokens.refreshToken());
        System.out.println("AuthCommandController.logout");
        return ResponseEntity.ok().build();
    }

}


