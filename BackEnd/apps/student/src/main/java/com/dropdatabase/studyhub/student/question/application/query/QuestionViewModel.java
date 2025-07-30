package com.dropdatabase.studyhub.student.question.application.query;

import java.util.List;
import java.util.UUID;

public record QuestionViewModel(
        UUID id,
        String text,
        List<OptionViewModel> options
) {
}
