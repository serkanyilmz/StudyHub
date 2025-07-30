package com.dropdatabase.studyhub.auth.application.security;

import com.dropdatabase.studyhub.auth.application.port.AuthCommandPort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityUserDetailsService implements UserDetailsService {

    private final AuthCommandPort authCommandPort;

    public SecurityUserDetailsService(AuthCommandPort authCommandPort) {
        this.authCommandPort = authCommandPort;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authCommandPort.findByUsername(username)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(() -> "ROLE_" + user.getRole().name())
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}