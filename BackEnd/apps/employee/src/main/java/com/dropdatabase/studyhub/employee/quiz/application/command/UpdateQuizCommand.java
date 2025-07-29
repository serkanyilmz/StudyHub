package com.dropdatabase.studyhub.employee.quiz.application.command;


import java.util.List;
import java.util.UUID;

public record UpdateQuizCommand(List<QuizQuestionCommand> quizQuestionCommandList,
                                UUID topicId,
                                UUID writerId) {
}