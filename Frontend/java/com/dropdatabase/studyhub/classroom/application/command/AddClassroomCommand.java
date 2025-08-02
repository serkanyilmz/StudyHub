package com.dropdatabase.studyhub.classroom.application.command;

import java.util.UUID;

public record AddClassroomCommand(
        String code, String name, UUID teacherId) {

}
