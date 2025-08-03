package com.dropdatabase.studyhub.question.application;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.common.MessageType;
import com.dropdatabase.studyhub.question.application.command.AddQuestionCommand;
import com.dropdatabase.studyhub.question.application.command.UpdateQuestionCommand;
import com.dropdatabase.studyhub.question.application.port.QuestionAIPort;
import com.dropdatabase.studyhub.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.topic.application.port.TopicCommandPort;
import com.dropdatabase.studyhub.topic.domain.Topic;
import com.dropdatabase.studyhub.writer.application.port.WriterCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuestionAIUseCase {

    private final QuestionCommandPort questionCommandPort;
    private final QuestionAIPort questionAIPort;
    private final TopicCommandPort topicCommandPort;

    public QuestionAIUseCase(QuestionCommandPort questionCommandPort,
                             QuestionAIPort questionAIPort,
                             TopicCommandPort topicCommandPort) {
        this.questionCommandPort = questionCommandPort;
        this.questionAIPort = questionAIPort;
        this.topicCommandPort = topicCommandPort;
    }

    @Transactional
    public String getAnswerExplanation(UUID id) {
        Question question = questionCommandPort.get(id);
        return questionAIPort.getAnswerExplanation(question);
    }

    public Question getSampleQuestion(UUID topicId) {
        Topic topic = topicCommandPort.get(topicId);
        return questionAIPort.getSampleQuestion(topic);
    }
}