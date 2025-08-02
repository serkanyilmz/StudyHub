package com.dropdatabase.studyhub.question.application.command;

import java.util.List;

public record AddQuestionCommand(
        String text,
        List<OptionCommand> options,
        String topicId,
        String writerId) {
}
