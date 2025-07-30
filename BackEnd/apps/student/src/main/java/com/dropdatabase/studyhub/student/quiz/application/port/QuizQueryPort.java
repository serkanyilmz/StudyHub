package com.dropdatabase.studyhub.student.quiz.application.port;

import com.dropdatabase.studyhub.student.quiz.domain.Quiz;

import java.util.List;
import java.util.UUID;

public interface QuizQueryPort {
    Quiz get(UUID id);
    List<Quiz> getAll();
}