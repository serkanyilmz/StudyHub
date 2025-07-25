package com.dropdatabase.studyhub.employee.teacher.application.port;

import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;

import java.util.List;

public interface TeacherQueryPort {
    List<Teacher> getAll();
}