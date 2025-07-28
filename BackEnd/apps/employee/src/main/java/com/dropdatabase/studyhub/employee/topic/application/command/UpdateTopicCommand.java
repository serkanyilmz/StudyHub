package com.dropdatabase.studyhub.employee.topic.application.command;

import java.util.UUID;

public record UpdateTopicCommand(
        String name,
        UUID parentTopicId) {
}