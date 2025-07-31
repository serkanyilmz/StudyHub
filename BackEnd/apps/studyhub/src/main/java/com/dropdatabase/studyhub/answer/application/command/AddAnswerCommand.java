package com.dropdatabase.studyhub.answer.application.command;

import java.util.UUID;

public record AddAnswerCommand(UUID questionId,
                               UUID optionId) {
}