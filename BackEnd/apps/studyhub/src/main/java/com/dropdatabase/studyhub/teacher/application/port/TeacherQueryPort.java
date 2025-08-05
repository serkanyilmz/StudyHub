package com.dropdatabase.studyhub.teacher.application.port;

import com.dropdatabase.studyhub.teacher.domain.Teacher;

import java.util.List;
import java.util.UUID;

public interface TeacherQueryPort {
    Teacher get(UUID id);
    List<Teacher> getAll();
    int getUniqueStudentsCount(UUID teacherId);
}