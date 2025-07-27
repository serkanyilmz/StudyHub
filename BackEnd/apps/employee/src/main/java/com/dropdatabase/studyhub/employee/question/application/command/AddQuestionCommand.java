package com.dropdatabase.studyhub.employee.question.application.command;

import java.util.List;

public record AddQuestionCommand(
        String text,
        List<OptionCommand> options) {
}