package com.dropdatabase.studyhub.answer.application;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.common.MessageType;
import com.dropdatabase.studyhub.answer.application.command.AddAnswerCommand;
import com.dropdatabase.studyhub.answer.application.port.AnswerCommandPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AnswerCommandUseCase {

    private final AnswerCommandPort answerCommandPort;

    public AnswerCommandUseCase(AnswerCommandPort answerCommandPort) {
        this.answerCommandPort = answerCommandPort;
    }

    @Transactional
    public Answer get(UUID id) {
        Answer answer = answerCommandPort.get(id);
        return answer;
    }

    @Transactional
    public MessageResponse add(AddAnswerCommand addAnswerCommand) {
        Answer newAnswer = addAnswerCommand.toDomainEntity();
        answerCommandPort.add(newAnswer);
        return new MessageResponse("Answer has added successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!answerCommandPort.exists(id)) {
            return new MessageResponse("Answer does not exist", MessageType.ERROR);
        }
        answerCommandPort.delete(id);
        return new MessageResponse("Answer has deleted successfully", MessageType.SUCCESS);
    }
}