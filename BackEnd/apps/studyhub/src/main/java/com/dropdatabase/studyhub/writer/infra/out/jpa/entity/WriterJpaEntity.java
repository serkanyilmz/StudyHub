package com.dropdatabase.studyhub.writer.infra.out.jpa.entity;

import com.dropdatabase.studyhub.writer.domain.Writer;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "writer")
@NoArgsConstructor
public class WriterJpaEntity {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;

    public WriterJpaEntity(Writer writer) {
        this.id = writer.getId().toString();
        this.firstName = writer.getFirstName();
        this.lastName = writer.getLastName();
        this.email = writer.getEmail();
        this.phoneNumber = writer.getPhoneNumber();
        this.registrationDate = LocalDateTime.now();
    }

    public Writer toDomainEntity() {
        return new Writer(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate
        );
    }
}