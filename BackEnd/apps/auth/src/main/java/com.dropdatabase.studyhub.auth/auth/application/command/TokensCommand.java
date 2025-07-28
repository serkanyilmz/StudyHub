package com.dropdatabase.studyhub.auth.auth.application.command;

public record TokensCommand(String accessToken,
                            String refreshToken) {}
