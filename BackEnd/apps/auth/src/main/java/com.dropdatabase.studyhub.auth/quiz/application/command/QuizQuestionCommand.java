package com.dropdatabase.studyhub.auth.quiz.application.command;

import java.util.UUID;

public record QuizQuestionCommand(UUID questionId,
                                  int questionNo) {
}