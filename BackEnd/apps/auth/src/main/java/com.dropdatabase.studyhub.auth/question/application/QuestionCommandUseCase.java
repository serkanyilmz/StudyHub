package com.dropdatabase.studyhub.auth.question.application;

import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.common.MessageType;
import com.dropdatabase.studyhub.auth.question.application.command.AddQuestionCommand;
import com.dropdatabase.studyhub.auth.question.application.command.UpdateQuestionCommand;
import com.dropdatabase.studyhub.auth.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.auth.question.domain.Option;
import com.dropdatabase.studyhub.auth.question.domain.Question;
import com.dropdatabase.studyhub.auth.topic.application.port.TopicCommandPort;
import com.dropdatabase.studyhub.auth.writer.application.port.WriterCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuestionCommandUseCase {

    private final QuestionCommandPort questionCommandPort;
    private final TopicCommandPort topicCommandPort;
    private final WriterCommandPort writerCommandPort;

    public QuestionCommandUseCase(QuestionCommandPort questionCommandPort,
                                  TopicCommandPort topicCommandPort,
                                  WriterCommandPort writerCommandPort) {
        this.questionCommandPort = questionCommandPort;
        this.topicCommandPort = topicCommandPort;
        this.writerCommandPort = writerCommandPort;
    }

    @Transactional
    public Question get(UUID id) {
        return questionCommandPort.get(id);
    }

    @Transactional
    public MessageResponse add(AddQuestionCommand addQuestionCommand) {
        Question newQuestion = new Question(
                addQuestionCommand.text(),
                topicCommandPort.get(UUID.fromString(addQuestionCommand.topicId())),
                writerCommandPort.get(UUID.fromString(addQuestionCommand.writerId()))
        );

        List<Option> options = addQuestionCommand.options().stream()
                .map(optionCommand -> new Option(
                        optionCommand.text(),
                        optionCommand.isCorrect()
                ))
                .collect(Collectors.toList());
        newQuestion.setOptions(options);

        questionCommandPort.add(newQuestion);
        return new MessageResponse("Question has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateQuestionCommand updateQuestionCommand) {
        if (!questionCommandPort.exists(id)) {
            return new MessageResponse("Question does not exist", MessageType.ERROR);
        }
        Question existingQuestion = questionCommandPort.get(id);

        Question updatedQuestion = new Question(existingQuestion.getId(), updateQuestionCommand.text(),
                topicCommandPort.get(UUID.fromString(updateQuestionCommand.topicId())),
                writerCommandPort.get(UUID.fromString(updateQuestionCommand.writerId()))
        );

        List<Option> options = updateQuestionCommand.options().stream()
                .map(optionCommand -> new Option(
                        optionCommand.text(),
                        optionCommand.isCorrect()
                ))
                .collect(Collectors.toList());
        updatedQuestion.setOptions(options);

        questionCommandPort.update(updatedQuestion);
        return new MessageResponse("Question has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!questionCommandPort.exists(id)) {
            return new MessageResponse("Question does not exist", MessageType.ERROR);
        }

        questionCommandPort.delete(id);
        return new MessageResponse("Question has deleted successfully", MessageType.SUCCESS);
    }
}