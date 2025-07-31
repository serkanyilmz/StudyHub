package com.dropdatabase.studyhub.student.infra.out.jpa.entity;

import com.dropdatabase.studyhub.classroom.domain.Classroom;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.student.domain.Student;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "student")
@NoArgsConstructor
@Getter
@Setter
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
        List<Classroom> classrooms = new ArrayList<>();
        for (ClassroomJpaEntity classroomJpaEntity : this.classrooms) {
            Classroom classroom = classroomJpaEntity.toDomainEntity();
            classrooms.add(classroom);
        }
        return new Student(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate,
                classrooms
        );
    }

}