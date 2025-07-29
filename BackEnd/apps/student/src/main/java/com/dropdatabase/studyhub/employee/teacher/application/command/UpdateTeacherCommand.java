package com.dropdatabase.studyhub.student.teacher.application.command;


public record UpdateTeacherCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}