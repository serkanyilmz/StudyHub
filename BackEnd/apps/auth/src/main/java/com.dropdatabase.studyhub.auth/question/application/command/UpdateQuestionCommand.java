package com.dropdatabase.studyhub.auth.question.application.command;

import java.util.List;

public record UpdateQuestionCommand(
        String text,
        List<OptionCommand> options,
        String topicId,
        String writerId) {
}