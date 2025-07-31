package com.dropdatabase.studyhub.question.application.command;

public record OptionCommand(
        String text,
        boolean isCorrect) {
}