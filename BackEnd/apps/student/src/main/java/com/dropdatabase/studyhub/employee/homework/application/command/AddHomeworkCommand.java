package com.dropdatabase.studyhub.student.homework.application.command;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record AddHomeworkCommand(String name,
                                 List<UUID> quizIdList,
                                 UUID classroomId,
                                 ZonedDateTime deadline) {
}