package com.dropdatabase.studyhub.question.application.command;

import java.util.List;

public record UpdateQuestionCommand(
        String text,
        List<OptionCommand> options,
        String topicId,
        String writerId) {
}