package com.dropdatabase.studyhub.student.topic.application.command;

import java.util.UUID;

public record UpdateTopicCommand(
        String name,
        UUID parentTopicId) {
}