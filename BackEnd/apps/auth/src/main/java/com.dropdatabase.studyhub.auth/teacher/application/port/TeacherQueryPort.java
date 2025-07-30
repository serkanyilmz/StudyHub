package com.dropdatabase.studyhub.auth.teacher.application.port;

import com.dropdatabase.studyhub.auth.teacher.domain.Teacher;

import java.util.List;
import java.util.UUID;

public interface TeacherQueryPort {
    Teacher get(UUID id);
    List<Teacher> getAll();
}