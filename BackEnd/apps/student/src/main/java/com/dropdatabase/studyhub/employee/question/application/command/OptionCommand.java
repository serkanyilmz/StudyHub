package com.dropdatabase.studyhub.student.question.application.command;

public record OptionCommand(
        String text,
        boolean isCorrect) {
}