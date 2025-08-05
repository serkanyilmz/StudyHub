package com.dropdatabase.studyhub.question.application.query;

import java.util.List;
import java.util.UUID;

public record QuestionViewModel(
        UUID id,
        String text,
        List<OptionViewModel> options,
        String topicId,
        String topicName,
        String writerId,
        String writerName
) {
}
