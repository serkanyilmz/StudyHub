package com.dropdatabase.studyhub.student.topic.application.command;

import java.util.UUID;

public record AddTopicCommand(
        String name,
        UUID parentTopicId) {
}