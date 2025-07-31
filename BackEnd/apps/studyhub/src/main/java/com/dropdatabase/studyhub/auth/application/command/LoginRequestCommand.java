package com.dropdatabase.studyhub.auth.application.command;

public record LoginRequestCommand(String username,
                                  String password) {}
