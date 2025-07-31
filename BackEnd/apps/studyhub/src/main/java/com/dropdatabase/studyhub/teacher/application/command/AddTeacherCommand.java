package com.dropdatabase.studyhub.teacher.application.command;


import com.dropdatabase.studyhub.teacher.domain.Teacher;

public record AddTeacherCommand(String firstName, String lastName, String email, String phoneNumber) {
    public Teacher toDomainEntity(){
        return new Teacher(firstName, lastName, email, phoneNumber);
    }
}