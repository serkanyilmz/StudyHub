package com.dropdatabase.studyhub.auth.application.command;

public record TokensCommand(String accessToken,
                            String refreshToken) {}
