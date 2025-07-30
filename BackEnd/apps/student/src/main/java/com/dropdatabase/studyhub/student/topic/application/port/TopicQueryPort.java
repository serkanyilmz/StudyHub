package com.dropdatabase.studyhub.student.topic.application.port;

import com.dropdatabase.studyhub.student.topic.domain.Topic;

import java.util.List;
import java.util.UUID;

public interface TopicQueryPort {
    Topic get(UUID id);
    List<Topic> getAll();
}