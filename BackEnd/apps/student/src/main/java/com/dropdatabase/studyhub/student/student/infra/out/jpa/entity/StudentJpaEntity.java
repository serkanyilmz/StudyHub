package com.dropdatabase.studyhub.student.student.infra.out.jpa.entity;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import com.dropdatabase.studyhub.student.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.student.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import com.dropdatabase.studyhub.student.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.student.student.domain.Student;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "student")
@NoArgsConstructor
public class StudentJpaEntity {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;

    @ManyToMany(mappedBy = "students")
    private List<ClassroomJpaEntity> classrooms = new ArrayList<>();

    public StudentJpaEntity(Student student) {
        this.id = student.getId().toString();
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
        this.email = student.getEmail();
        this.phoneNumber = student.getPhoneNumber();
        this.registrationDate = LocalDateTime.now();
    }

    public Student toDomainEntity() {
        return new Student(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate
        );
    }
}