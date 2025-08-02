package com.dropdatabase.studyhub.auth.application.command;

public record LoginResponseCommand(String accessToken,
                                   String refreshToken) {}
