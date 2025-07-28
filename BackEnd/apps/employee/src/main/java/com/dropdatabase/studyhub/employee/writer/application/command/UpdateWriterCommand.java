package com.dropdatabase.studyhub.employee.writer.application.command;


public record UpdateWriterCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}