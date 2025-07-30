package com.dropdatabase.studyhub.auth.topic.application;

import com.dropdatabase.studyhub.auth.topic.application.port.TopicQueryPort;
import com.dropdatabase.studyhub.auth.topic.domain.Topic;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TopicQueryUseCase {

    private final TopicQueryPort topicQueryPort;

    public TopicQueryUseCase(TopicQueryPort topicQueryPort) {
        this.topicQueryPort = topicQueryPort;
    }

    public List<Topic> getAll() {
        return topicQueryPort.getAll();
    }

    public Topic get(UUID id) {return topicQueryPort.get(id);
    }
}