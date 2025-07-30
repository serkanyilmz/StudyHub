package com.dropdatabase.studyhub.auth.homework.application.command;


import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateHomeworkCommand(String name,
                                    List<UUID> quizIdList,
                                    UUID classroomId,
                                    ZonedDateTime deadline) {
}