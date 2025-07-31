package com.dropdatabase.studyhub.quiz.application.port;

import com.dropdatabase.studyhub.quiz.domain.Quiz;

import java.util.UUID;

public interface QuizCommandPort {
    boolean exists(UUID id);
    Quiz get(UUID id);
    void add(Quiz newQuiz);
    void update(Quiz updatedQuiz);
    void delete(UUID id);
    int getQuestionNumber(UUID quizId);
}