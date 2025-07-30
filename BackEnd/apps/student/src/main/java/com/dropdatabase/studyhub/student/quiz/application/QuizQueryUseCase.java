package com.dropdatabase.studyhub.student.quiz.application;

import com.dropdatabase.studyhub.student.quiz.application.port.QuizQueryPort;
import com.dropdatabase.studyhub.student.quiz.domain.Quiz;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class QuizQueryUseCase {

    private final QuizQueryPort quizQueryPort;

    public QuizQueryUseCase(QuizQueryPort quizQueryPort) {
        this.quizQueryPort = quizQueryPort;
    }

    public List<Quiz> getAll() {
        return quizQueryPort.getAll();
    }

    public Quiz get(UUID id) {return quizQueryPort.get(id);
    }
}