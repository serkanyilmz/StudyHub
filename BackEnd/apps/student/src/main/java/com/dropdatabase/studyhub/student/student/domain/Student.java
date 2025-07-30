package com.dropdatabase.studyhub.student.student.domain;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
public class Student {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;
    private List<Classroom> classes = new ArrayList<>();


    public Student(String firstName, String lastName, String email, String phoneNumber) {
        this.id = UUID.randomUUID();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Student(UUID id,
                   String firstName,
                   String lastName,
                   String email,
                   String phoneNumber,
                   LocalDateTime registrationDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
    }
}