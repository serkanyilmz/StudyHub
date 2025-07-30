package com.dropdatabase.studyhub.auth.quiz.application.command;


import java.util.List;
import java.util.UUID;

public record UpdateQuizCommand(String name,
                                List<QuizQuestionCommand> quizQuestionCommandList,
                                UUID topicId,
                                UUID writerId) {
}