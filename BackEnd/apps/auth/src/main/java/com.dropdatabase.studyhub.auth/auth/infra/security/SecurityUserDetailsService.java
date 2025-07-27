package com.dropdatabase.studyhub.auth.auth.infra.security;

import com.dropdatabase.studyhub.auth.auth.application.port.AuthQueryPort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityUserDetailsService implements UserDetailsService {

    private final AuthQueryPort authQueryPort;

    public SecurityUserDetailsService(AuthQueryPort authQueryPort) {
        this.authQueryPort = authQueryPort;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authQueryPort.findByUsername(username)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(() -> "ROLE_" + user.getRole().name())
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}