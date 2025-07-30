package com.dropdatabase.studyhub.student.topic.application.port;

import com.dropdatabase.studyhub.student.topic.domain.Topic;

import java.util.UUID;

public interface TopicCommandPort {
    boolean exists(UUID id);
    Topic get(UUID id);
    void add(Topic newTopic);
    void update(Topic updatedTopic);
    void delete(UUID id);
}