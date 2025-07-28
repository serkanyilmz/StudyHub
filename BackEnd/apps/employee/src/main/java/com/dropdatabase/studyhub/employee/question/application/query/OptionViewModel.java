package com.dropdatabase.studyhub.employee.question.application.query;

import java.util.UUID;

public record OptionViewModel(
        UUID id,
        String text,
        boolean isCorrect
) {
}
