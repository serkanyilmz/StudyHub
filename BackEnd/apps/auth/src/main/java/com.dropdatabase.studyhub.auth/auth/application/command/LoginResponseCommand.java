package com.dropdatabase.studyhub.auth.auth.application.command;

public record LoginResponseCommand(String accessToken,
                                   String refreshToken) {}
