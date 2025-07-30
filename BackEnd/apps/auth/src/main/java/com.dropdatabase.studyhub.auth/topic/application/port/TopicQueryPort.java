package com.dropdatabase.studyhub.auth.topic.application.port;

import com.dropdatabase.studyhub.auth.topic.domain.Topic;

import java.util.List;
import java.util.UUID;

public interface TopicQueryPort {
    Topic get(UUID id);
    List<Topic> getAll();
}