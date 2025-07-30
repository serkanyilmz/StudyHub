package com.dropdatabase.studyhub.auth.topic.application;

import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.common.MessageType;
import com.dropdatabase.studyhub.auth.topic.application.command.AddTopicCommand;
import com.dropdatabase.studyhub.auth.topic.application.command.UpdateTopicCommand;
import com.dropdatabase.studyhub.auth.topic.application.port.TopicCommandPort;
import com.dropdatabase.studyhub.auth.topic.domain.Topic;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TopicCommandUseCase {

    private final TopicCommandPort topicCommandPort;

    public TopicCommandUseCase(TopicCommandPort topicCommandPort) {
        this.topicCommandPort = topicCommandPort;
    }

    @Transactional
    public Topic get(UUID id) {
        return topicCommandPort.get(id);
    }

    @Transactional
    public MessageResponse add(AddTopicCommand addTopicCommand) {
        Topic newTopic = new Topic(addTopicCommand.name(),
                topicCommandPort.get(addTopicCommand.parentTopicId()));
        topicCommandPort.add(newTopic);

        return new MessageResponse("Topic has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateTopicCommand updateTopicCommand) {
        if (!topicCommandPort.exists(id)) {
            return new MessageResponse("Topic does not exist", MessageType.ERROR);
        }
        Topic existingTopic = topicCommandPort.get(id);
        Topic updatedTopic = new Topic(existingTopic.getId(),
                updateTopicCommand.name(),
                topicCommandPort.get(updateTopicCommand.parentTopicId()));
        topicCommandPort.update(updatedTopic);

        return new MessageResponse("Topic has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!topicCommandPort.exists(id)) {
            return new MessageResponse("Topic does not exist", MessageType.ERROR);
        }
        topicCommandPort.delete(id);
        return new MessageResponse("Topic has deleted successfully", MessageType.SUCCESS);
    }
}