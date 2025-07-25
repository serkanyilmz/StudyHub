package com.dropdatabase.studyhub.employee.teacher.application.port;

import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;

import java.util.UUID;

public interface TeacherCommandPort {
    Teacher get(UUID id);
    Teacher add(Teacher newTeacher);
    Teacher update(Teacher updatedTeacher);
}