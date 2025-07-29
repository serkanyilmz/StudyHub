package com.dropdatabase.studyhub.employee.quiz.application.port;

import com.dropdatabase.studyhub.employee.quiz.domain.Quiz;

import java.util.List;
import java.util.UUID;

public interface QuizQueryPort {
    Quiz get(UUID id);
    List<Quiz> getAll();
}