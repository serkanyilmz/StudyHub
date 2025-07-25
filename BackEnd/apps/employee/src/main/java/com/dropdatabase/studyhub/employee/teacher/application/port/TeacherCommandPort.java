package com.dropdatabase.studyhub.employee.teacher.application.port;

import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;

import java.util.UUID;

public interface TeacherCommandPort {
    boolean exists(UUID id);
    Teacher get(UUID id);
    void add(Teacher newTeacher);
    void update(Teacher updatedTeacher);
    void delete(UUID id);
}