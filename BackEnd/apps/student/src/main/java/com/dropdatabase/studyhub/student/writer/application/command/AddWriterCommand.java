package com.dropdatabase.studyhub.student.writer.application.command;


import com.dropdatabase.studyhub.student.writer.domain.Writer;

public record AddWriterCommand(String firstName, String lastName, String email, String phoneNumber) {
    public Writer toDomainEntity(){
        return new Writer(firstName, lastName, email, phoneNumber);
    }
}