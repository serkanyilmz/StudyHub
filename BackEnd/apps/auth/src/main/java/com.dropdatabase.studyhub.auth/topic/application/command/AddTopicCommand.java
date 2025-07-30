package com.dropdatabase.studyhub.auth.topic.application.command;

import java.util.UUID;

public record AddTopicCommand(
        String name,
        UUID parentTopicId) {
}