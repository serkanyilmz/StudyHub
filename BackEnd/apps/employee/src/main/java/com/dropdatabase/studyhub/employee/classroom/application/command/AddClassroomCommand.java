package com.dropdatabase.studyhub.employee.classroom.application.command;

import com.dropdatabase.studyhub.employee.classroom.domain.Classroom;
import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;

import java.util.UUID;

public record AddClassroomCommand(
        String code, String name, UUID teacherId) {

}