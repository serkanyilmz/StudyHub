package com.dropdatabase.studyhub.auth.quiz.application.port;

import com.dropdatabase.studyhub.auth.quiz.domain.Quiz;

import java.util.UUID;

public interface QuizCommandPort {
    boolean exists(UUID id);
    Quiz get(UUID id);
    void add(Quiz newQuiz);
    void update(Quiz updatedQuiz);
    void delete(UUID id);
}