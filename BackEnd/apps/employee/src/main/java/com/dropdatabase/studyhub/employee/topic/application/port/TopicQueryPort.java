package com.dropdatabase.studyhub.employee.topic.application.port;

import com.dropdatabase.studyhub.employee.topic.domain.Topic;

import java.util.List;
import java.util.UUID;

public interface TopicQueryPort {
    Topic get(UUID id);
    List<Topic> getAll();
}