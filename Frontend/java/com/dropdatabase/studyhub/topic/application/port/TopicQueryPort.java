package com.dropdatabase.studyhub.topic.application.port;

import com.dropdatabase.studyhub.topic.domain.Topic;

import java.util.List;
import java.util.UUID;

public interface TopicQueryPort {
    Topic get(UUID id);
    List<Topic> getAll();
}
