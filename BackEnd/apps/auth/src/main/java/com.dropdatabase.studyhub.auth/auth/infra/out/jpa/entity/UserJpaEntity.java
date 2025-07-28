package com.dropdatabase.studyhub.auth.auth.infra.out.jpa.entity;

import com.dropdatabase.studyhub.auth.auth.domain.model.Role;
import com.dropdatabase.studyhub.auth.auth.domain.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJpaEntity {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String fullName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "approved", nullable = false)
    private boolean approved;


    // Veri tabanından yükleme için constructor
    public UserJpaEntity(UUID id, String username, String password,String fullName, Role role, LocalDateTime createdAt, LocalDateTime updatedAt, boolean approved) {
        this.id = id.toString();
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.approved = approved;
    }

    // Domain modelden entity oluşturma, kayıt esnasında createdAt güncelleniyor
    public UserJpaEntity(User user) {
        this.id = user.getId() != null ? user.getId().toString() : UUID.randomUUID().toString();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.fullName = user.getFullName();
        this.role = user.getRole();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = user.getUpdatedAt();
        this.approved = user.isApproved();
    }


    public User toDomainEntity() {
        return new User(
                UUID.fromString(this.id),
                this.username,
                this.password,
                this.fullName,
                this.role,
                this.createdAt,
                this.updatedAt,
                this.approved
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserJpaEntity)) return false;
        UserJpaEntity that = (UserJpaEntity) o;
        return Objects.equals(id, that.id) && Objects.equals(username, that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username);
    }

}

