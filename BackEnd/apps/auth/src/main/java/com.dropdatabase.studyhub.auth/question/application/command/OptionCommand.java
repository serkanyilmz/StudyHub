package com.dropdatabase.studyhub.auth.question.application.command;

public record OptionCommand(
        String text,
        boolean isCorrect) {
}