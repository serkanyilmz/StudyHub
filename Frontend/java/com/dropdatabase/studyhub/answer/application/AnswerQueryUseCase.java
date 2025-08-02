package com.dropdatabase.studyhub.answer.application;

import com.dropdatabase.studyhub.answer.application.port.AnswerQueryPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnswerQueryUseCase {

    private final AnswerQueryPort answerQueryPort;

    public AnswerQueryUseCase(AnswerQueryPort answerQueryPort) {
        this.answerQueryPort = answerQueryPort;
    }

    public List<Answer> getAll() {
        return answerQueryPort.getAll();
    }

    public Answer get(UUID id) {return answerQueryPort.get(id);
    }
}
