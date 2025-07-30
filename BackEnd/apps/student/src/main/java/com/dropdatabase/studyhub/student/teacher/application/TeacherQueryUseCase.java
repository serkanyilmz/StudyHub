package com.dropdatabase.studyhub.student.teacher.application;

import com.dropdatabase.studyhub.student.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.student.teacher.domain.Teacher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TeacherQueryUseCase {

    private final TeacherQueryPort teacherQueryPort;

    public TeacherQueryUseCase(TeacherQueryPort teacherQueryPort) {
        this.teacherQueryPort = teacherQueryPort;
    }

    public List<Teacher> getAll() {
        return teacherQueryPort.getAll();
    }

    public Teacher get(UUID id) {return teacherQueryPort.get(id);
    }
}