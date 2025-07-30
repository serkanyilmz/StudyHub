package com.dropdatabase.studyhub.student.student.application.command;


public record UpdateStudentCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}