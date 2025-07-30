package com.dropdatabase.studyhub.auth.topic.application.command;

import java.util.UUID;

public record UpdateTopicCommand(
        String name,
        UUID parentTopicId) {
}