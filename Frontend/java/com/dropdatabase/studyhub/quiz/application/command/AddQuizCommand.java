package com.dropdatabase.studyhub.quiz.application.command;

import java.util.List;
import java.util.UUID;

public record AddQuizCommand(String name,
                             List<QuizQuestionCommand> quizQuestionCommandList,
                             UUID topicId,
                             UUID writerId) {
}
