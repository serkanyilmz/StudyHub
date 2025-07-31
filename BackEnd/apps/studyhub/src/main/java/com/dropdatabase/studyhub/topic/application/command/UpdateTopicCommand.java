package com.dropdatabase.studyhub.topic.application.command;

import java.util.UUID;

public record UpdateTopicCommand(
        String name,
        UUID parentTopicId) {
}