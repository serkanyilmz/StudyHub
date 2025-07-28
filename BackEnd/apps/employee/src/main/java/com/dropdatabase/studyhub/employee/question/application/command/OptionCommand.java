package com.dropdatabase.studyhub.employee.question.application.command;

public record OptionCommand(
        String text,
        boolean isCorrect) {
}