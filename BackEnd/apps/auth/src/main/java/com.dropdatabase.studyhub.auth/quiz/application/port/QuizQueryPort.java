package com.dropdatabase.studyhub.auth.quiz.application.port;

import com.dropdatabase.studyhub.auth.quiz.domain.Quiz;

import java.util.List;
import java.util.UUID;

public interface QuizQueryPort {
    Quiz get(UUID id);
    List<Quiz> getAll();
}