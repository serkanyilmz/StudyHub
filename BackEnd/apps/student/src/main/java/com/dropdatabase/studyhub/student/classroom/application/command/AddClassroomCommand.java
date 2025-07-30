package com.dropdatabase.studyhub.student.classroom.application.command;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import com.dropdatabase.studyhub.student.teacher.domain.Teacher;

import java.util.UUID;

public record AddClassroomCommand(
        String code, String name, UUID teacherId) {

}