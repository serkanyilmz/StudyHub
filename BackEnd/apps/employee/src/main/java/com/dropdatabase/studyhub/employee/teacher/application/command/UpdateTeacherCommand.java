package com.dropdatabase.studyhub.employee.teacher.application.command;


public record UpdateTeacherCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}