package com.dropdatabase.studyhub.answer.application;


import com.dropdatabase.studyhub.answer.application.port.AnswerAIPort;
import com.dropdatabase.studyhub.answer.application.port.AnswerQueryPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnswerAIUseCase {

    private final AnswerAIPort answerAIPort;
    private final AnswerQueryPort answerQueryPort;

    public AnswerAIUseCase(AnswerAIPort answerAIPort, AnswerQueryPort answerQueryPort) {
        this.answerAIPort = answerAIPort;
        this.answerQueryPort = answerQueryPort;
    }

    @Transactional
    public List<String> getStudentProgress(UUID studentId) {
        List<Answer> answers = answerQueryPort.getAllByStudentId(studentId).stream()
                .collect(Collectors.toList());

        if (answers.isEmpty()) return List.of("No Progress", "Start solving to track progress");
        return answerAIPort.getStudentProgress(answers);
    }
}
