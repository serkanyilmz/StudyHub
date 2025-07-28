package com.dropdatabase.studyhub.auth.auth.application.command;

import com.dropdatabase.studyhub.auth.auth.domain.model.Role;

public record RegisterRequestCommand(String username, String password, String fullName, Role role) { }
