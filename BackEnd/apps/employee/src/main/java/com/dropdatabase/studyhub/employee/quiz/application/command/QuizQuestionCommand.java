package com.dropdatabase.studyhub.employee.quiz.application.command;

import java.util.UUID;

public record QuizQuestionCommand(UUID questionId,
                                  int questionNo) {
}