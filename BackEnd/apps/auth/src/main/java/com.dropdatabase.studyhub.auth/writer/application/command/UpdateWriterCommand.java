package com.dropdatabase.studyhub.auth.writer.application.command;


public record UpdateWriterCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}