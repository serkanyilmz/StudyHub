package com.dropdatabase.studyhub.auth.classroom.application.command;


import java.util.UUID;

public record UpdateClassroomCommand(
        String code, String name, UUID teacherId) {

}