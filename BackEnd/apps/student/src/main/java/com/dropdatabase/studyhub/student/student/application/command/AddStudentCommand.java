package com.dropdatabase.studyhub.student.student.application.command;


import com.dropdatabase.studyhub.student.student.domain.Student;

public record AddStudentCommand(String firstName, String lastName, String email, String phoneNumber) {
    public Student toDomainEntity(){
        return new Student(firstName, lastName, email, phoneNumber);
    }
}