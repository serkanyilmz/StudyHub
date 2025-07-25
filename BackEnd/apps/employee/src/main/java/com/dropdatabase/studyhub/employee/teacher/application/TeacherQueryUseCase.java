package com.dropdatabase.studyhub.employee.teacher.application;

import com.dropdatabase.studyhub.employee.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherQueryUseCase {

    private final TeacherQueryPort teacherQueryPort;

    public TeacherQueryUseCase(TeacherQueryPort teacherQueryPort) {
        this.teacherQueryPort = teacherQueryPort;
    }

    public List<Teacher> getAll() {
        return teacherQueryPort.getAll();
    }
}