package com.dropdatabase.studyhub.quiz.application.port;

import com.dropdatabase.studyhub.quiz.domain.Quiz;

import java.util.List;
import java.util.UUID;

public interface QuizQuestionQueryPort {
        int getQuestionNumber(UUID quizId);
}
