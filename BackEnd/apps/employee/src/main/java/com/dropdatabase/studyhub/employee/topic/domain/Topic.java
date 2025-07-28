package com.dropdatabase.studyhub.employee.topic.domain;

import lombok.Getter;
import java.util.UUID;

@Getter
public class Topic {
    private UUID id;
    private String name;
    private Topic parentTopic;

    public Topic(String name, Topic parentTopic) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.parentTopic = parentTopic;
    }

    public Topic(UUID id,
                 String name,
                 Topic parentTopic) {
        this.id = id;
        this.name = name;
        this.parentTopic = parentTopic;
    }
}