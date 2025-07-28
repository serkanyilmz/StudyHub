package com.dropdatabase.studyhub.employee.question.application;

import com.dropdatabase.studyhub.employee.question.application.port.QuestionQueryPort;
import com.dropdatabase.studyhub.employee.question.application.query.QuestionViewModel;
import com.dropdatabase.studyhub.employee.question.domain.Question;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuestionQueryUseCase {

    private final QuestionQueryPort questionQueryPort;

    public QuestionQueryUseCase(QuestionQueryPort questionQueryPort) {
        this.questionQueryPort = questionQueryPort;
    }

    public List<QuestionViewModel> getAll() {
        return questionQueryPort.getAll().stream()
                .map(Question::toViewModel)
                .collect(Collectors.toList());
    }

    public QuestionViewModel get(UUID id) {return questionQueryPort.get(id).toViewModel();
    }
}