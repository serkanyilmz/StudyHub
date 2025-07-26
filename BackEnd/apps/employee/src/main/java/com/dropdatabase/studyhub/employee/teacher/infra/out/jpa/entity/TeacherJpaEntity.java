package com.dropdatabase.studyhub.employee.teacher.infra.out.jpa.entity;

import com.dropdatabase.studyhub.employee.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "teacher")
@NoArgsConstructor
public class TeacherJpaEntity {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;

    public TeacherJpaEntity(Teacher teacher) {
        this.id = teacher.getId().toString();
        this.firstName = teacher.getFirstName();
        this.lastName = teacher.getLastName();
        this.email = teacher.getEmail();
        this.phoneNumber = teacher.getPhoneNumber();
        this.registrationDate = LocalDateTime.now();
    }

    public Teacher toDomainEntity() {
        return new Teacher(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate
        );
    }
}