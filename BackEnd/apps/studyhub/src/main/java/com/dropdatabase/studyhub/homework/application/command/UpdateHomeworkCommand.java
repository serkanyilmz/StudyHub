package com.dropdatabase.studyhub.homework.application.command;


import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateHomeworkCommand(String name,
                                    List<UUID> quizIdList,
                                    UUID classroomId,
                                    ZonedDateTime deadline) {
}