package com.dropdatabase.studyhub.employee.question.application;

import com.dropdatabase.studyhub.employee.question.application.port.QuestionQueryPort;
import com.dropdatabase.studyhub.employee.question.domain.Question;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class QuestionQueryUseCase {

    private final QuestionQueryPort questionQueryPort;

    public QuestionQueryUseCase(QuestionQueryPort questionQueryPort) {
        this.questionQueryPort = questionQueryPort;
    }

    public List<Question> getAll() {
        return questionQueryPort.getAll();
    }

    public Question get(UUID id) {return questionQueryPort.get(id);
    }
}