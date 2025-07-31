package com.dropdatabase.studyhub.answer.application.command;

import java.util.List;
import java.util.UUID;

public record AddAnswerCommand(UUID quizId,
                               UUID questionId,
                               UUID optionId) {
}