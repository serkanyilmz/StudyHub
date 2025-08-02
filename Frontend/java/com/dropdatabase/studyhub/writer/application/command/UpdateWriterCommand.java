package com.dropdatabase.studyhub.writer.application.command;


public record UpdateWriterCommand(
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber) {
}
