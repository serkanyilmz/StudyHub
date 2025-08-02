package com.dropdatabase.studyhub.auth.application.command;

import com.dropdatabase.studyhub.auth.domain.model.Role;

public record RegisterRequestCommand(String username,
                                     String password,
                                     String fullName,
                                     Role role) { }
