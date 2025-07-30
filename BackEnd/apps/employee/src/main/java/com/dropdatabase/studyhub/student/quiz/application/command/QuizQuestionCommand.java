package com.dropdatabase.studyhub.student.quiz.application.command;

import java.util.UUID;

public record QuizQuestionCommand(UUID questionId,
                                  int questionNo) {
}