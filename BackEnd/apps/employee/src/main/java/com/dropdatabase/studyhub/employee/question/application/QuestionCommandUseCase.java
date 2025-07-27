package com.dropdatabase.studyhub.employee.question.application;

import com.dropdatabase.studyhub.employee.common.MessageResponse;
import com.dropdatabase.studyhub.employee.common.MessageType;
import com.dropdatabase.studyhub.employee.question.application.command.AddQuestionCommand;
import com.dropdatabase.studyhub.employee.question.application.command.OptionCommand;
import com.dropdatabase.studyhub.employee.question.application.command.UpdateQuestionCommand;
import com.dropdatabase.studyhub.employee.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.employee.question.domain.Option;
import com.dropdatabase.studyhub.employee.question.domain.Question;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuestionCommandUseCase {

    private final QuestionCommandPort questionCommandPort;

    public QuestionCommandUseCase(QuestionCommandPort questionCommandPort) {
        this.questionCommandPort = questionCommandPort;
    }

    @Transactional
    public Question get(UUID id) {
        Question question = questionCommandPort.get(id);
        return question;
    }

    @Transactional
    public MessageResponse add(AddQuestionCommand addQuestionCommand) {
        Question newQuestion = new Question(addQuestionCommand.text());

        List<Option> options = addQuestionCommand.options().stream()
                .map(optionCommand -> new Option(
                        optionCommand.text(),
                        optionCommand.isCorrect(),
                        newQuestion
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

        Question updatedQuestion = new Question(existingQuestion.getId(), updateQuestionCommand.text());

        List<Option> options = updateQuestionCommand.options().stream()
                .map(optionCommand -> new Option(

                        // TODO: it needs to update options in database

                        optionCommand.text(),
                        optionCommand.isCorrect(),
                        updatedQuestion
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