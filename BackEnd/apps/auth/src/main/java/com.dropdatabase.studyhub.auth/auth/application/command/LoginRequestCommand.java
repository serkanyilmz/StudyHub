package com.dropdatabase.studyhub.auth.auth.application.command;

public record LoginRequestCommand(String username,
                                  String password) {}
